import Image from "next/image";
import { GiWeightLiftingUp } from "react-icons/gi";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center border lg:flex-row">
        <div className="hidden lg:flex justify-center items-center h-full bg-[#242424] lg:w-1/2">
          <div className="flex relative !p-10 items- h-full w-full text-white">
            {/* <Image
              objectPosition="cover"
              className="absolute opacity-70"
              src={"/images/Technogym.jpg"}
              alt={""}
              fill
            /> */}
            <div className="flex h-10 justify-center items-center z-10 inset-10">
              <div className="flex gap-3 justify-center items-center">
                <GiWeightLiftingUp className=" h-9 w-9" />
                <h1 className="text-xl font-bold">TechnoGym</h1>
              </div>
            </div>

            <div className="absolute bottom-10 z-10 inset-x-10">
              <blockquote className="italic">
                Strength doesn&apos;t come from what you can do. It comes from
                overcoming the things you once thought you couldn&apos;t.
                <br />
              </blockquote>
              <span className="text-sm"> &mdash; unknown</span>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center overflow-x-hidden p-4 lg:w-1/2">
          {children}
        </div>
      </div>
    </div>
  );
}
