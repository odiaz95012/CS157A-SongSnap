import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Offcanvas, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';

interface Streak {
  UserID: number;
  StreakID: number;
  StartDate: string;
  EndDate: string;
  Length: number;
}
interface User {
  Username: string;
  name: string;
  ProfilePicture: string;
  ID: number;
}
interface StreaksContainerProps {
  userDetails: User;
}

const StreaksContainer: React.FC<StreaksContainerProps> = ({ userDetails }: StreaksContainerProps) => {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [longestStreak, setLongestStreak] = useState<Streak | null>(null);
  const [showOffCanvas, setShowOffCanvas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await Cookies.get('userID');
        const responseStreaks = await axios.get<Streak[]>(`/users/personalStreaks?id=${userID}`);
        const responseLongestStreak = await axios.get<Streak[]>(`/users/longestStreak?id=${userID}`);

        setStreaks(responseStreaks.data);
        setLongestStreak(responseLongestStreak.data[0]);
      } catch (error) {
        console.error('Error fetching streaks:', error);
      }
    };

    fetchData();
  }, []);

  const handleCloseOffCanvas = () => {
    setShowOffCanvas(false);
  };

  return (
    <Container className="text-center mt-3">
      <Row>
        <Col>
          <Button variant="primary" onClick={() => setShowOffCanvas(true)}>
            View Streak History
          </Button>
        </Col>
      </Row>

      <Offcanvas show={showOffCanvas} onHide={handleCloseOffCanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Streaks</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {longestStreak && (
            <div>
              <h5 className="text-center">Longest Streak</h5>
              {/* Display information for the longest streak */}
              <Card className="mb-3 longest-streak-card text-center mx-auto" style={{ maxWidth: 'fit-content' }}>
                <Card.Body>
                  <Card.Title>{`Streak #${longestStreak.StreakID}`}</Card.Title>
                  <Card.Text>
                    {`Start Date: ${longestStreak.StartDate ? longestStreak.StartDate.substring(0, 10) : 'Not Available'}`}
                  </Card.Text>
                  <Card.Text>
                    {`End Date: ${longestStreak.EndDate ? longestStreak.EndDate.substring(0, 10) : 'Present'}`}
                  </Card.Text>
                  <Card.Text>{`Length: ${longestStreak.Length}`}</Card.Text>
                </Card.Body>
              </Card>
              <hr />
            </div>
          )}
          <h5 className="text-center">Streak History</h5>
          <div className="scrolling-container d-flex flex-column justify-content-center text-center">
            {streaks.length === 0 ? (
              <div className="no-streaks-message">No streaks yet :(</div>
            ) : (
              <div>
                {streaks.map((streak) => (
                  <Card className="mb-3 streak-card text-center">
                    <Card.Body>
                      {/* Display streak information*/}
                      <Card.Title>{`Streak #${streak.StreakID}`}</Card.Title>
                      <Card.Text>
                        {`Start Date: ${streak.StartDate ? streak.StartDate.substring(0, 10) : 'Not Available'}`}
                      </Card.Text>
                      <Card.Text>
                        {`End Date: ${streak.EndDate ? streak.EndDate.substring(0, 10) : 'Present'}`}
                      </Card.Text>
                      <Card.Text>{`Length: ${streak.Length}`}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default StreaksContainer;
