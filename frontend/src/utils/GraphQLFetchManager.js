import axios from 'axios';
export const graphQLFetch = (query, method) => {
    const config = {
         method, 
         headers: { "Content-Type": "application/json" }, 
    };
    return axios.post("/graphql", JSON.stringify({ query }), config)
    .then(res=>{return res.data.data});
}