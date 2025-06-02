import PersonalDetails from "../component/personal-details";
import ContactInfo from "../component/contact-info";
import ChangePassword from "../component/change-password";
import { auth } from "@/auth";
import { getUserByEmail } from "@/queries/users";

async function Profile() {
	const session = await auth(); 
    const loggedInUser = await getUserByEmail(session?.user?.email);

    // Serialize the user data to plain objects
    const serializedUser = loggedInUser ? {
        firstName: loggedInUser.firstName || '',
        lastName: loggedInUser.lastName || '',
        email: loggedInUser.email || '',
        designation: loggedInUser.designation || '',
        bio: loggedInUser.bio || '',
        phone: loggedInUser.phone || '',
        profilePicture: loggedInUser.profilePicture || '',
        role: loggedInUser.role || '',
        status: loggedInUser.status || '',
        id: loggedInUser.id || loggedInUser._id?.toString() || ''
    } : null;

	return (
		<>
			<PersonalDetails userInfo={serializedUser} />
			<div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
				<div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
					<ContactInfo />
					<ChangePassword email={serializedUser?.email} />
					{/*end col*/}
				</div>
				{/*end row*/}
			</div>
		</>
	);
}

export default Profile;