import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import NavBar from '../components/NavBar';
import axios from 'axios';

function AdminPage() {

  interface UserPromptSubmission {
    PromptID: number;
    PromptText: string;
    UserID: number;
    Username: string;
    Theme: string;
    DateCreated: string;
  }
  interface DailyPrompt {
    PromptID: number;
    PromptText: string;
    Theme: string;
  }

  const [userPromptSubmissions, setUserPromptSubmissions] = useState<UserPromptSubmission[]>([{
    PromptID: 0,
    PromptText: '',
    UserID: 0,
    Username: '',
    DateCreated: '',
    Theme: ''
  }]);

  const [dailyPrompts, setDailyPrompts] = useState<DailyPrompt[]>([{
    PromptID: 0,
    PromptText: '',
    Theme: ''
  }]);

  const getUserSubmittedPrompts = async () => {
    try {
      const response = await axios.get('/prompts/all/userSubmissions');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getAllDailyPrompts = async () => {
    try {
      const response = await axios.get('/prompts/');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const addUserPromptToDailyPrompts = async (promptID: number) => {
    try {
      const response = await axios.post('/prompts/add', {
        promptID: promptID
      });
      console.log(response.data);
      setDailyPrompts([...dailyPrompts, response.data.promptData]);
      setUserPromptSubmissions(userPromptSubmissions.filter((prompt) => prompt.PromptID !== promptID));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userPrompts = await getUserSubmittedPrompts();
      setUserPromptSubmissions(userPrompts);
      const dailyPrompts = await getAllDailyPrompts();
      setDailyPrompts(dailyPrompts);
    };
    fetchData();
  }, []);

  const formatDate = (inputDate: string): string => {
    const date = new Date(inputDate);
    const now = new Date();

    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12

        const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;

        return formattedTime;
    } else {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear() % 100;
        const formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year.toString().padStart(2, '0')}`;
        return formattedDate;
    }
};

  return (
    <>
      <NavBar />
      <Container className='my-5'>
        <Row>
          <Col>
            <div className='text-center'>
              <h1>Admin Page</h1>
              <p className='lead'>Select the user submitted prompts you'd like to put into the daily prompt rotation.</p>
            </div>
            <Container>
              <Row>
                <Col>
                  <div className='text-center my-2'>
                    <h3>Submitted Prompts</h3>
                    <p className='lead'>These are the prompts that users have submitted.</p>
                  </div>
                  <Container className="overflow-auto" style={{ width: '75%', height: '500px', border: '1px solid black' }}>
                    {userPromptSubmissions.map((prompt, index) => {
                      return (
                        <div key={index}>
                          <ListGroup>
                            <ListGroup.Item className='my-2' variant='dark'>
                              <div className='d-flex justify-content-end align-items-center'>
                                <PlusCircle 
                                  className='me-2' size={25} color='blue' style={{cursor: 'pointer'}} 
                                  onClick={() => addUserPromptToDailyPrompts(prompt.PromptID)}/>
                              </div>
                              <p className='lead'>Prompt Submission by: {prompt.Username}</p>
                              <p>Prompt: {prompt.PromptText}</p>
                              <p>Theme: {prompt.Theme}</p>
                              <p>Date Submitted: {formatDate(prompt.DateCreated)}</p>
                            </ListGroup.Item>
                          </ListGroup>
                        </div>
                      );
                    })}
                  </Container>
                </Col>
                <Col>
                  <div className='text-center my-2'>
                    <h3>Approved Prompts</h3>
                    <p className='lead'>These are the prompts that are currently in the daily prompt rotation.</p>
                  </div>
                  <Container className="overflow-auto" style={{ width: '75%', height: '500px', border: '1px solid black' }}>
                  {dailyPrompts.map((prompt, index) => {
                      return (
                        <div key={index}>
                          <ListGroup>
                            <ListGroup.Item className='my-2' variant='dark'>
                              <p>Prompt: {prompt.PromptText}</p>
                              <p>Theme: {prompt.Theme}</p>
                            </ListGroup.Item>
                          </ListGroup>
                        </div>
                      );
                    })}
                  </Container>
                </Col>
              </Row>
            </Container>

          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AdminPage