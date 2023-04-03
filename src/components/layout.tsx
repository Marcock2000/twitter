import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return(

        <main className="flex w-2/4 h-screen justify-center">
        <div className="w-full h-full overflow-y-scroll scrollbar-hide border-x border-slate-400 md:max-w-2xl ">

            {props.children}
            </div>

        </main>
    )};