import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

interface ViewContextType {
    view: string;
    setView: Dispatch<SetStateAction<string>>;
}

// Default values are undefined, but they will be provided by our provider component.
export const ViewContext = createContext<ViewContextType>({
    view: '',
    setView: () => {}
});
