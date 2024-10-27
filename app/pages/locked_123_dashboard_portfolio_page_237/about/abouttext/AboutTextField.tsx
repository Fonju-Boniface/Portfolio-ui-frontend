// AboutTextField
"use client";

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from "../../../../firebase"; // Adjust the path as needed

const AboutTextField = () => {
    const [text, setText] = useState<string | null>(null);

    useEffect(() => {
        const textRef = ref(database, 'your-about-text');
        onValue(textRef, (snapshot) => {
            const snapshotData = snapshot.val();
            setText(snapshotData || '');
        });
    }, []);

    return (
        <>
            {/* {text ? (
                <p className='text-center'>Loading...</p>
            ) : (

            )} */}
            <div className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto text-justify">{text ? text : <p className='text-center'>Loading...</p> }</div>
        </>
    );
};

export default AboutTextField;