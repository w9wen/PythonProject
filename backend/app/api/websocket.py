from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json
from app.core.deps import get_current_user_ws

router = APIRouter()

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_text(message)

    async def broadcast(self, message: str):
        for user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_text(message)

manager = ConnectionManager()

websocket_router = APIRouter()

@websocket_router.websocket("/ws/{user_token}")
async def websocket_endpoint(websocket: WebSocket, user_token: str):
    user = await get_current_user_ws(user_token)
    if not user:
        await websocket.close(code=1008)  # Policy violation
        return
        
    await manager.connect(websocket, user.id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process the message and broadcast to relevant users
            await manager.send_personal_message(
                json.dumps({"message": message_data.get("message"), "sender": user.username}),
                user.id
            )
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)
        await manager.broadcast(json.dumps({"event": "user_disconnected", "user_id": user.id}))
