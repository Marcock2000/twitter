import { useState } from "react";
import useDebouncedCallback from "debounce";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";
import Image from "next/image";

export const SpotifySearchBar = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();
  const [input, setInput] = useState<string>("");
  const [mutationInput, setMutation] = useState<string>("");
  const ctx = api.useContext();
  const CLIENT_ID = process.env.CLIENT_ID
  const CLIENT_SECRET = process.env.CLIENT_SECRET

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: (data) => {
      setInput("");
      void ctx.posts.getAll.invalidate();
      setSearchResults([])
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInput(inputValue);

    if (inputValue.trim() !== "") {
      setIsLoading(true);
      searchDebounced(inputValue);
    } else {
      setSearchResults([]);
    }
  };

  const handleSongSelect = (name: string, spotifyUrl: string) => {
    setInput(name);
    setMutation(spotifyUrl);
    console.log(spotifyUrl)
  };

  const search = async (query: string) => {
    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
          },
        }
      );


      const accessToken = tokenResponse.data.access_token;

      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
     
      const tracks = response.data.tracks.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        album: item.album.name,
        spotifyUrl: item.external_urls.spotify,
      }));

      setSearchResults(tracks);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      console.log(CLIENT_ID)

      toast.error("Failed to fetch search results");
      setIsLoading(false);
    }
  };

  const searchDebounced = useDebouncedCallback(search, 500);



  console.log(user);
  if (!user) return null ;


    return (
        <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-3">
          <Image src={user.profileImageUrl} 
            alt="Profile Image" 
            className="h-14 w-14 rounded-full"
            width={56}
            height={56}
          />
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="What&apos;s the soundtrack for today?"
            className="bg-transparent rounded-md p-2 w-full"
          />
          {isLoading && <LoadingSpinner />}
          {input !== "" && !isPosting && (
          <button 
            onClick={() => mutate({content: mutationInput})}
            disabled={isPosting}
            className="bg-slate-400 text-white rounded-md p-2 w-20 mt-2">
              Post
          </button>
        )}
        </div>
        {searchResults.length > 0 && (
          <ul className="rounded-md shadow-md py-2 px-3">
            {searchResults.map((result) => (
              <li key={result.id} onClick={() => handleSongSelect(result.name, result.spotifyUrl)} className="hover:bg-slate-600 cursor-pointer py-1 px-2 rounded-lg">
                {`${result.name} - ${result.artist}`}
              </li>
            ))}
          </ul>
        )}

        {isPosting && (
          <div className="flex items-center justify-center mt-2">
            <LoadingSpinner size={20}/>
          </div>
        )}
      </div>
    )
};