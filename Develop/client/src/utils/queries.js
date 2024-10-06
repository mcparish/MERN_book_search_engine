// this will hold the query GET_ME that will execute the me query set up in the server
import { gql } from '@apollo/client';

export const GET_ME = gql `query Query {
    me {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
}`