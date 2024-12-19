import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState({});
    const [createNotifications, setCreateNotifications] = useState({});
    const [pusherThread, setPusherThread] = useState({});

    useEffect(() => {
        // Configure Pusher client
        const pusher = new Pusher('c2c6e8d77a411d6cc315', {
            cluster: 'ap2',
        });


        // Subscribe to the channels
        const channel = pusher.subscribe('trades-channel');
        const coinChannel = pusher.subscribe('coin-created-channel');
        const threadsChannel = pusher.subscribe('threads-channel');

        // Handle coin-created event
        coinChannel.bind('coin-created', (data) => {
            console.log("Coin Pusher Data Received:", data);
            setCreateNotifications({
                user_name: data.user_name,
                action: data.action,
                coin_photo: data.coin_photo,
                status: data.status,
                date: data.date,
                replies: data.replies,
                ticker: data.ticker,
                token_id: data.token_id,
                market_cap: data.market_cap,
                bonding_curve: data.bonding_curve,
                ticker: data.ticker,
                name: data.name,
                description: data.description,
            });
        });

        // Handle trade-initiated event
        channel.bind('trade-initiated', (data) => {
            console.log("Trade Data Received:", data);
            setNotifications({
                user_name: data.user_name,
                action: data.action,
                coin_photo: data.coin_photo,
                token_address: data.token_address,
                user_image: data.user_image,
            });
        });

        // Handle coin-created event
        threadsChannel.bind('new-reply', (data) => {
            console.log("threads Pusher Data Received:", data);
            setPusherThread({
                user_name: data.user_name,
                user_profile: data.user_profile,
                token_id: data.token_id,
                thread_id: data.thread_id,
                text: data.text,
                created_at: data.created_at,
            });
        });

        // Cleanup on unmount
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            coinChannel.unbind_all();
            coinChannel.unsubscribe();
            threadsChannel.unbind_all();
            threadsChannel.unsubscribe();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, createNotifications, pusherThread }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    return useContext(NotificationContext);
};
