import {  SignInButton,  SignOutButton,  useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { api } from "~/utils/api";
import type  {RouterOutputs}  from "~/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";


const CreatePostWizard = () => {

  const {user} = useUser();
  const [input, setInput] = useState<string>("");
  const ctx = api.useContext();


  const {mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: (data) => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
    } else {
      toast.error("Something went wrong");
    }
  },});



  console.log(user);
  if (!user) return null ;

  return (
  <div className="flex w-full gap-3 ">
    <Image src={user.profileImageUrl} 
    alt="Profile Image" 
    className="h-14 w-14 rounded-full "
    width={56}
    height={56}
    />
   <input 
      value={input}
      onChange={(e) => setInput(e.target.value)}
      type="text" 
      placeholder="Post a spotify link!" 
      className="bg-transparent rounded-md p-2 ml-4 w-full" 
      disabled={isPosting}
      />
    {input !== "" && !isPosting && ( <button 
      onClick={() => mutate({content: input})}
      disabled={isPosting}
      className="bg-slate-400 text-white rounded-md p-2 ml-4 w-20">Post
      </button>)}

      {isPosting && (
        <div className="flex items-center justify-center">
        <LoadingSpinner size={20}/>
        </div>)}
       
  </div>);
  } ;


const Feed = () => {

  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading ) return <LoadingPage/>

  if (!data) return <div> Something went wrong</div>
return (
  <div className="flex flex-col">
  {data?.map((fullPost) => (
    <PostView {...fullPost} key= {fullPost.post.id}/>))}
</div>
)
  }
  
  // if both arent loaded


const Home: NextPage = () => {
  api.posts.getAll.useQuery();

  const { isLoaded: userLoaded, isSignedIn} = useUser();
  
  // if both arent loaded 
if (!userLoaded ) return <div/>



return (
  <PageLayout>
    <div className="flex border-b border-slate-400 p-4">
      {!isSignedIn && (
        <div className="flex justify-center">
          <SignInButton />
        </div>
      )}
      {isSignedIn && <CreatePostWizard />}
    </div>
      <Feed/>
      </PageLayout>
    
  );
};


export default Home;
