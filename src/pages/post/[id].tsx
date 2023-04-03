import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { isLoaded: userLoaded, isSignedIn} = useUser();

  const { data } = api.posts.getByID.useQuery({
    id,
  });
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <div className="flex flex-row flex-row-1 h-screen w-full">
      <div className= "flex flex-col flex-col-auto  w-1/4 p-5"> 

      <Link href ="/" className="text-2xl font-bold mt-10 text-slate-300 font-serif">Sparrows</Link>
       <p className="text-lg font-thin mt-10 text-slate-300 "> 
        You want to let the world know what you're listening to, but there's just something awkward about posting your favorite songs on social media.
        <br/> 
        <br/>Enter Sparrows, a place to share your brilliant music taste without being obnoxious. 
        You only get one song per day, though, so make it count.</p>


      </div>
      
      <PageLayout>
        <PostView {...data} />
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
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getByID.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;