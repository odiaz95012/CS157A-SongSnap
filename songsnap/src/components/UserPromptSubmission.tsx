import React, { useState, useEffect } from 'react';
import PopUpModal from './PopUpModal';
import UserPromptSubmissionForm from './UserPromptSubmissionForm';
import Cookies from 'js-cookie';
import axios from 'axios';

function UserPromptSubmission() {

    type PromptSubmission = {
        promptText: string;
        promptTheme: string;
    };

    const [formData, setFormData] = useState<PromptSubmission>({
        promptText: '',
        promptTheme: ''
    });

    const handleSubmit = (formData: PromptSubmission) => {
        setFormData(formData);
    };

    const postSubmission = async (formData:PromptSubmission) => {
        if (formData.promptText === '' || formData.promptTheme === '') {
            alert('Please fill out all fields.');
            return;
        }
        try {
            const response = await axios.post('/prompts/post/userSubmission', {
                promptText: formData.promptText,
                theme: formData.promptTheme,
                userID: await Cookies.get('userID')
            });
            if(response.status === 200) {
                alert('Prompt submitted successfully!');
                setFormData({promptText: '', promptTheme: ''});
            }
        } catch (error) {
            console.error(error);
            alert('An error occured while submitting the prompt. Please try again.');
            setFormData({promptText: '', promptTheme: ''});
        }
    };

    return (
        <>
            <PopUpModal
                title="User Prompt Submission"
                body={<UserPromptSubmissionForm onSubmit={handleSubmit}/>}
                submitButtonText='Submit Prompt'
                openButtonText='User Prompt Submission'
                functionToExecute={(() => postSubmission(formData))}
            />
        </>
    )
}

export default UserPromptSubmission