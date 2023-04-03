import {  SignInButton,  useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { SpotifySearchBar } from "~/components/createPost";




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
      {isSignedIn && <SpotifySearchBar/>}
    </div>
      <Feed/>
      </PageLayout>
    
  );
};


export default Home;
