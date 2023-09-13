import { flushSync } from "react-dom";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name='description' content={props.meetupData.description}/>
            </Head>
            <MeetupDetail image={props.meetupData.image} title={props.meetupData.title}
            address={props.meetupData.address} description={props.meetupData.description}  />
        </Fragment>
    );
}
export async function getStaticPaths(){
    const client = await MongoClient.connect('mongodb+srv://Sravani:K3rWQflJzfWSNpI7@cluster0.i2ovsng.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({},{_id:1}).toArray();
    client.close();

    return{
        fallback : 'blocking',
        paths: meetups.map(meetup => ({
            params: {
                meetupId: meetup._id.toString()
            }
        }))
    };
}

export async function getStaticProps(context) {
    //fetch data for single meetup
    const meetupId = context.params.meetupId;
    const client = await MongoClient.connect('mongodb+srv://Sravani:K3rWQflJzfWSNpI7@cluster0.i2ovsng.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({_id: new ObjectId(meetupId)}); //in mongodb, the id's are stored in this ObjectId type 
    
    console.log(selectedMeetup);
    client.close();                                                                    //but the meetupId is fetched from the url which will be string.so converting it to objectId type.

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                image: selectedMeetup.image,
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            },
        },
    };
}
export default MeetupDetails;