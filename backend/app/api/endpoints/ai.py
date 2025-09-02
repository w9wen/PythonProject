from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.models import User
import os

# Import AI libraries conditionally to handle when API keys aren't available
try:
    from openai import OpenAI
    from langchain.llms import OpenAI as LangchainOpenAI
    from langchain.chains import LLMChain
    from langchain.prompts import PromptTemplate
except ImportError:
    pass

router = APIRouter()

class AIRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 100

class AIResponse(BaseModel):
    text: str

@router.post("/generate", response_model=AIResponse)
async def generate_ai_response(
    request: AIRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a response using OpenAI"""
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    try:
        client = OpenAI(api_key=openai_api_key)
        response = client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt=request.prompt,
            max_tokens=request.max_tokens
        )
        return {"text": response.choices[0].text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/langchain", response_model=AIResponse)
async def generate_langchain_response(
    request: AIRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a response using Langchain"""
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    try:
        template = """Question: {question}

        Answer: """
        prompt = PromptTemplate(template=template, input_variables=["question"])
        
        llm = LangchainOpenAI(openai_api_key=openai_api_key)
        llm_chain = LLMChain(prompt=prompt, llm=llm)
        
        response = llm_chain.run(question=request.prompt)
        return {"text": response.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Langchain service error: {str(e)}")
