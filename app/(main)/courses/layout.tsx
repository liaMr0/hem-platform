import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({children}:any) => {
	const session = await auth();
		
		  if (!session?.user) {
			console.log(session?.user);
			redirect('/');}
	return (
		<div>
			{children}
		</div>
	);
}

export default Layout;
