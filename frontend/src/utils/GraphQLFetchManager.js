import axios from 'axios';
export const graphQLFetch = (query) => {
    const config = {
         method:"post", 
         headers: { "Content-Type": "application/json" }, 
    };
    return axios.post("/graphql", JSON.stringify({ query }), config)
    .then(res=>{
        if(res.data.errors){
            throw new Error(res.data.errors[0].message);
        }else if(res.data.error){
            throw new Error(res.data.error.message);
        }
        return res.data.data});
}

export const objectToGraphQLObject=(object)=>{
    return JSON.stringify(object).replace(/"([^"]+)":/g, '$1:');
}