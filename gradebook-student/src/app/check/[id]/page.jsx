'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function Page() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.post('/api/check', { id }); // Use absolute URL
                console.log(result.data);

                // setData(submissions)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Update loading state after request completes
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>Check {id}</h1>
        </div>
    );
}

export default Page;
