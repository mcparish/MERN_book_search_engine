import  { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations'; // Make sure the path is correct
import Auth from '../utils/auth';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]); // Define searchedBooks state
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds()); // Define savedBookIds state
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors?.join(', '),
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail,
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };
  

  

  // Use the SAVE_BOOK mutation
  const [saveBook] = useMutation(SAVE_BOOK);



  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);


    // Temporary book to save function for when the API has reached its limit.  

    // const bookToSave = {
    //   authors: ["Author Name"],
    //   description: "This is a description",
    //   title: "The Title",
    //   bookId: "12345",
    //   image: "http://placehold.it/300x300",
    //   link: "http://www.google.com"
    // }

    // Check if the bookToSave exists
    if (!bookToSave) {
      console.error('Book not found!');
      return;
    }

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Execute the SAVE_BOOK mutation
      const { data } = await saveBook({
        variables: { bookInput: bookToSave }, // Include other necessary fields
      });

      // Check if the response is successful
      if (!data) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!searchInput) {
  //     return false;
  //   }
  //   try {
  //     const response = await searchGoogleBooks(searchInput);
  //     if (!response.ok) {
  //       throw new Error(`Error fetching books: ${response.status}`);
  //     }
  //     const { items } = await response.json();
  //     const bookData = items.map((book) => ({
  //       book.Id: book.id,
  //       authors: book.volumeInfo.authors || ['No author to display'],
  //       title: book.volumeInfo.title,
  //       description: book.volumeInfo.description,
  //       image: book.volumeInfo.imageLinks?.thumbnail || '',
  //     }));
  //     setSearchedBooks(bookData);
  //     setSearchInput(''); // Clear the search input after successful search
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
    

    
  //   // Implement your search logic here and update searchedBooks
  // };

  return (
    <>
      <div className="text-light bg-dark p-5">

      {/* <button onClick={handleSaveBook}>Temporary Save Book</button> */}

        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
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

export default SearchBooks;