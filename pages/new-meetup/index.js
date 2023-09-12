import { useRouter } from 'next/router';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';
import Head from 'next/head';
import { Fragment } from 'react';

function NewMeetupPage() {

    const router = useRouter();
    async function addMeetupHandler(enteredMeetupData) {
        //send a request to api route
        const response = await fetch('/api/new-meetup', {
            method: 'POST',
            body: JSON.stringify(enteredMeetupData),
            headers: {
                'Content-Type': 'application/json'
            }
        }); //this will send request to api/new-meetup.js file which triggers the handler func in that file
        const data = await response.json();
        console.log(data);
        router.push('/');

    }
    return (
        <Fragment>
             <Head>
                <title>New Meetup</title>
                <meta name='description' content='Add a new meetup and create amazing networking opportunities.' />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </Fragment>
        
    );
}
export default NewMeetupPage;

