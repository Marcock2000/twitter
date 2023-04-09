import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";


type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const {post,author} = props;

  const spotifyPlayerUrl = post.content.replace("https://open.spotify.com/", "https://open.spotify.com/embed/");

  return (
    <div key={post.id} className="border-b border-slate-400 pl-4 pr-4 pt-4 flex">
      <Image src={author.profileImageUrl} alt="Profile Image" className="h-14 w-14 rounded-full " width={56} height={56}/>
      <div className="flex flex-col ml-4">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}><span>{`@${author.username} `}</span></Link>


          <Link href={`/post/${post.id  } `}> <span className="font-thin">
             {`· ${dayjs(post.createdAt).fromNow()}` }
          </span></Link>

        </div>
        {post.content.includes("https://open.spotify.com/") ?
          <div className="spotify-player mt-5 ml-5">
            <iframe src={spotifyPlayerUrl} width="250" height="280" frameBorder="0"  allow="encrypted-media"></iframe>
          </div>
          :
          <span className= "text-2xl">{post.content}</span>
        }
      </div>
    </div>
  );
}
