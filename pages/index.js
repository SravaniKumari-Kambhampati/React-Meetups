import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';


const DUMMY_MEETUPS = [
    {
        id: 'm1',
        title: 'First Meetup',
        image: 'https://i.ytimg.com/vi/m4nUM8qEToM/maxresdefault.jpg',
        address: '11227 foxhaven dr',
        description: 'our first meetup'
    },
    {
        id: 'm2',
        title: 'Second Meetup',
        image: 'https://nycdsa-blog-files.s3.us-east-2.amazonaws.com/2018/03/picture.jpg',
        address: '11223 foxhaven dr',
        description: 'our Second meetup'
    }
];

function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name='description' content='Browse a huge list of highly active React Meetups!' />
            </Head>
            <MeetupList meetups={props.meetups} />  
        </Fragment>
        
    );
}

//here in this page, we dont have data that changes frequently and we dont need access to context, so using getStaticProps func

// export async function getServerSideProps(context){      //same as getStaticProps func, but this will run on server for every  incoming request.
//     // useful if we have data that changes frequently.
//     const req = context.req;  
//     const res = context.res;    //we can access data of incoming requests and responses

//     //fetch data from api
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }
export async function getStaticProps() {   //this function will be executed by nextjs when it pre renders the pages i.e., before this page components executes!
    //fetch data from api  and is faster than getServerSideProps func
    const client = await MongoClient.connect("mongodb+srv://Sravani:K3rWQflJzfWSNpI7@cluster0.i2ovsng.mongodb.net/meetups?retryWrites=true&w=majority");

    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();      //it will by default find all the collections in the db

    client.close();
    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            }))  //we should always return this props object. this props will be received by this page component. here HomePage
        },
        revalidate: 2       //this helps to re pregenerate the pages for every mentioned no.of secs even after deployement
    }
}
export default HomePage;