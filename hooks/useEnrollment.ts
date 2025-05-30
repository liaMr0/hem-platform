// hooks/useEnrollment.ts
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface EnrollmentState {
    isEnrolled: boolean;
    isLoading: boolean;
    isChecking: boolean;
    error: string | null;
}

interface UseEnrollmentReturn extends EnrollmentState {
    enroll: () => Promise<void>;
    checkEnrollment: () => Promise<void>;
    resetError: () => void;
}

export const useEnrollment = (courseId: string): UseEnrollmentReturn => {
    const { data: session } = useSession();
    const [state, setState] = useState<EnrollmentState>({
        isEnrolled: false,
        isLoading: false,
        isChecking: true,
        error: null
    });

    const checkEnrollment = useCallback(async () => {
        if (!session?.user?.id || !courseId) {
            setState(prev => ({ ...prev, isChecking: false }));
            return;
        }

        setState(prev => ({ ...prev, isChecking: true, error: null }));

        try {
            const response = await fetch('/api/enrollments/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    userId: session.user.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to check enrollment');
            }

            setState(prev => ({
                ...prev,
                isEnrolled: data.isEnrolled,
                isChecking: false
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to check enrollment',
                isChecking: false
            }));
        }
    }, [courseId, session?.user?.id]);

    const enroll = useCallback(async () => {
        if (!session?.user?.id || !courseId) {
            setState(prev => ({
                ...prev,
                error: 'Please login to enroll in courses'
            }));
            return;
        }

        if (state.isEnrolled) {
            setState(prev => ({
                ...prev,
                error: 'You are already enrolled in this course'
            }));
            return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch('/api/enrollments/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    userId: session.user.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Enrollment failed');
            }

            setState(prev => ({
                ...prev,
                isEnrolled: true,
                isLoading: false
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Enrollment failed';
            
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
                isEnrolled: errorMessage.includes('already enrolled') ? true : prev.isEnrolled
            }));
        }
    }, [courseId, session?.user?.id, state.isEnrolled]);

    const resetError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    useEffect(() => {
        checkEnrollment();
    }, [checkEnrollment]);

    return {
        ...state,
        enroll,
        checkEnrollment,
        resetError
    };
};