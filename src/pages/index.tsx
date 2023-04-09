import {  SignInButton,  SignOutButton,  useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { SpotifySearchBar } from "~/components/createPost";
import { Head } from "next/head";




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

  const { isLoaded: userLoaded, isSignedIn, user} = useUser();
  const authorID = user?.id ?? "";
  
  // if both arent loaded 
if (!userLoaded ) return <div/>



return (
  <>
  <Head>
    <title>Sparrows</title>
    <script defer data-domain="sparrows-nine.vercel.app" src="https://plausible.io/js/script.js"></script>
    


  </Head>
  <div className="flex flex-row flex-row-1 h-screen w-full ">
  <div className= "flex flex-col flex-col-auto  w-1/4 p-5"> 

      <p className="text-2xl font-bold mt-10 text-slate-300 font-serif">Sparrows</p>
      <p className="text-lg font-thin mt-10 text-slate-300 "> 
      You want to let the world know what you're listening to, but there's just something awkward about posting your favorite songs on social media.
      <br/> 
      <br/>Enter Sparrows, a place to share your brilliant music taste without being obnoxious. 
      You only get one song per day, though, so make it count.</p>
  

  </div>
  
  <PageLayout>
    <div className="flex border-b border-slate-400 p-4">
      {!isSignedIn && (
        <div className="flex justify-center">
          <SignInButton />
        </div>
      )}

      {isSignedIn && <SpotifySearchBar id={user.id} username={null} profileImageUrl={""}  />}
    </div>
      <Feed/>
      </PageLayout>
      <div className= "flex flex-col flex-col-auto  w-1/4 p-5"> 
      {isSignedIn && (
    
    <div className="flex text-lg font-semibold">
    <SignOutButton />

    </div>)}
      </div>
  </div>
  </>
    
  );
  
};


export default Home;


