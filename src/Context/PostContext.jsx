import axios from "axios";
import { createContext } from "react";

export const PostContext = createContext()

export default function PostContextProvider(props) {

    function getPosts() {
        return axios.get('https://linked-posts.routemisr.com/posts?limit=50', 
        {
            headers : {
                token : localStorage.getItem('token')
            },
        })
        .then(res => {
            return res.data.posts;
        }).catch(err => {
            return err
        });
    }

    return (
        <PostContext.Provider value={{getPosts}}>
            {props.children}
        </PostContext.Provider>
    );
} 