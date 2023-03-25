import {  useUser } from "@clerk/nextjs";
import {type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";
import {api} from "~/utils/api";

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


  const { data} = api.profile.getUserByUsername.useQuery({username,});

  if (!data) return <div> 404</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
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
      </>
    );
  };


import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';
import { PageLayout } from "~/components/layout";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {prisma, userId: null},
    transformer: superjson, // optional - adds superjson serialization
  })
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
