import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Alert
} from 'react-bootstrap';

import { GET_ME } from '../utils/queries'; // Adjust the import based on your queries file
import { REMOVE_BOOK } from '../utils/mutations'; // Import the REMOVE_BOOK mutation
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  const { loading, data } = useQuery(GET_ME, {
    // onCompleted: (data) => setUserData(data.me), // Assuming your query returns a user object
    // onError: (err) => console.error(err),
  });
  const userData = data?.me || {};
  // Use the REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK, {
    // onCompleted: (data) => {
    //   // Update userData after successful deletion
    //   // setUserData(data.removeBook); // Adjust based on your GraphQL response structure
    //    // Remove the book ID from localStorage
    // },
    onError: (err) => {
      console.error(err);
    },
  });

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }, // Pass the bookId as a variable to the mutation
      });
      removeBookId(bookId)
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;

// remove the useEffect() hook that sets the state for UserData
// Instead, use the useQuery() hook to execute the GET_ME query on load and save it to a variable named userData
// Use the useMutation() hook to execute the REMOVE_BOOK mutation in the handleDeleteBook() function instead of the deleteBook() function that's imported from API file.  Make sure you keep the removeBookId() function in place.  

