import { gql } from "@apollo/client";

export const GET_ME = gql`
  {
    query GET_ME {    
        me {
            _id
            email
            username
            savedBooks {
                bookId
                description
                title
                link
                authors
                image
            }
        }
    }
  }
`;
