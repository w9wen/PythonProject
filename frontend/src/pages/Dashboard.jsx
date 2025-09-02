import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const ItemsSection = styled.div`
  margin-top: 2rem;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ItemCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ItemTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ItemDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: #0b5ed7;
  }
`;

const CreateItemForm = styled.form`
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 100px;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.getItems();
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createItem(newItem);
      setItems([...items, response.data]);
      setNewItem({ title: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <DashboardContainer>
      <WelcomeSection>
        <Title>Welcome, {user?.username || 'User'}!</Title>
        <Subtitle>This is your personal dashboard. Here you can manage your items and see your activity.</Subtitle>
        
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create New Item'}
        </Button>
      </WelcomeSection>
      
      {showCreateForm && (
        <CreateItemForm onSubmit={handleCreateItem}>
          <h2>Create New Item</h2>
          
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </FormGroup>
          
          <Button type="submit">Save Item</Button>
        </CreateItemForm>
      )}
      
      <ItemsSection>
        <h2>Your Items</h2>
        
        {loading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>You don't have any items yet. Create one to get started!</p>
        ) : (
          <ItemsList>
            {items.map(item => (
              <ItemCard key={item.id}>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
                <Button onClick={() => handleDeleteItem(item.id)}>Delete</Button>
              </ItemCard>
            ))}
          </ItemsList>
        )}
      </ItemsSection>
    </DashboardContainer>
  );
};

export default Dashboard;
