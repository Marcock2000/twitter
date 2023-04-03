import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";
import { api } from "~/utils/api";

import Image from "next/image";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";


const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({userId: props.userId,});

  if (isLoading) return <div> <LoadingPage/> </div>

  if (!data || data.length === 0)  return <div> User does not have any posts</div>

  return <div className="flex flex-col">
    {data.map((fullPost) => (
    <PostView {...fullPost}  key={fullPost.post.id} />
    ))}
  </div>
}


const ProfilePage: NextPage<{username: string}> = ({username}) => {

  const { isLoaded: userLoaded, isSignedIn} = useUser();
  const { data} = api.profile.getUserByUsername.useQuery({username,});

  if (!data) return <div> 404</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <div className="flex flex-row flex-row-1 h-screen w-full ">
  <div className= "flex flex-col flex-col-auto  w-1/4 p-5"> 

  <Link href ="/" className="text-2xl font-bold mt-10 text-slate-300 font-serif">Sparrow</Link>

      <p className="text-lg font-thin mt-10 text-slate-300 "> 
      You want to let the world know what you're listening to, but there's just something awkward about posting your favorite songs on social media.
      <br/> 
      <br/>Enter Sparrows, a place to share your brilliant music taste without being obnoxious. 
      You only get one song per day, though, so make it count.</p>
  

  </div>


      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id}/>
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


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()
  const slug = context.params?.slug;

  if (typeof slug !== 'string') {
    throw new Error('No slug');
  }
  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    }
  };
};

export const getStaticPaths =  () => {
  return {
    paths: [] , fallback: "blocking"
  }
}

export default ProfilePage;
