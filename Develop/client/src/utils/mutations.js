// LOGIN_USER will execute the loginUser mutation set up using Apollo Server.
// ADD_USER will execute the addUser mutation.
// SAVE_BOOK will execute the saveBook mutation.
// REMOVE_BOOK will execute the removeBook mutation.
import { gql } from '@apollo/client';


export const ADD_USER = gql `mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
    user {
            _id
            username
            email
        }
    }
}`
export const LOGIN_USER = gql `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
    user {
            _id
            email
            username
        }
    }
}`
export const SAVE_BOOK = gql `mutation Mutation($bookInput: BookInput!) {
    saveBook(bookInput: $bookInput) {
        _id
        bookCount
        email
        username
    }
}`

export const REMOVE_BOOK = gql `mutation Mutation($bookId: ID!) {
    removeBook(bookId: $bookId) {
        _id
        bookCount
        email
        username
    }
}`