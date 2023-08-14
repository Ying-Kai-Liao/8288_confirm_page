// RouteComponent.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentSuccessAnimation from './PaymentSuccess';

const RouteComponent = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const merchantTradeNo = queryParams.get('MerchantTradeNo');
    const itemName = queryParams.get('ItemName');

    const [responseData, setResponseData] = useState<any>(null);
    const [success, setSuccess] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>(null)

    const handlePrint = () => {
        window.print();
    };

    // DELETE here for production

    const mockResponseData = {
        RtnCode: "1",
        RtnMsg: "成功.",
        PlatformID: "",
        MerchantID: "1010605",
        OrderInfo: {
            MerchantTradeNo: "11412",
            TradeNo: "2308141118054989",
            TradeAmt: 40,
            PaymentType: "Credit",
            PaymentDate: "2023/08/14 11:18:36",
            TradeDate: "2023/08/14 11:18:05",
            TradeStatus: "1",
            ChargeFee: 5
        },
        CustomField: "",
        CardInfo: {
            AuthCode: "832076",
            Gwsr: 13009444,
            ProcessDate: "2023/08/14 11:18:36",
            Amount: 40,
            Eci: 5,
            Card6No: "447757",
            Card4No: "5016"
        }
    };

    // Function that simulates a fetch call
    const mockFetch = async () => {
        return {
            json: async () => mockResponseData
        };
    };

    const fetchData = async () => {
        try {
            const url = 'https://8288girl.com/wp-json/api/check_pay_ready';
            const requestData = {
                MerchantTradeNo: merchantTradeNo
            };


            // ADD here when production
            // const response = await fetch(url,  {
            //     method: 'POST',
            //     headers: {
            //         'Contetn-Type': 'application/json',
            //     },
            //     body: JSON.stringify(requestData),
            // });

            const mockResponse = await mockFetch();
            const data: any = await mockResponse.json(); // revise HERE to response
            if (data.RtnCode === "1") {
                setCorrect(true);
            }
            setResponseData(data);
        } catch (error) {
            console.error('Error fetcching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (responseData?.OrderInfo) {
            setOrderInfo(responseData.OrderInfo);
        }
    }, [responseData]);

    useEffect(() => {
        if (orderInfo?.TradeStatus === "1") {
            setSuccess(true);
        }
    }, [orderInfo])

    const dateParts = orderInfo?.PaymentDate.split(" ")[0]?.split("/");
    const timeParts = orderInfo?.PaymentDate.split(" ")[1]?.split(":");


    if (!correct) {
        return (
            <div className='flex items-center justify-center flex-col mt-32'>
                <div className='flex flex-col text-center rounded-[20px] bg-white max-w-[500px] mx-5 md:w-[500px] shadow-lg 2xl p-10'>
                    訂單編號有誤，請聯繫客服人員
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='flex items-center justify-center flex-col' id='card'>
                <PaymentSuccessAnimation success={success} />
                <div className='flex flex-col text-center rounded-[20px] bg-white max-w-[500px] mx-5 md:w-[500px] shadow-lg'>
                    <div className='p-4 rounded-[20px] m-4 mt-20'>
                        <div className='text-[20px] font-semibold'>
                            {success ? '付款成功' : '付款失敗'}
                        </div>
                        <div className='text-[30px] font-semibold'>
                            {orderInfo?.TradeAmt + orderInfo?.ChargeFee}元
                        </div>
                    </div>
                    <div className='px-10 pb-10 divide-y divide-dashed'>
                        <div className='py-5 flex flex-col'>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>訂單編號</div>
                                <div className='font-semibold'>{merchantTradeNo}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>商品名稱</div>
                                <div className='font-semibold'>8288 VIP</div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>付款方式</div>
                                <div className='font-semibold'>
                                    {responseData?.CardInfo && '信用卡'}
                                    {responseData?.CVSInfo && '超商繳費'}
                                    {responseData?.ATMInfo && 'ATM繳費'}
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>付款日期</div>
                                <div className='font-semibold'>{(dateParts && dateParts.length >= 3) ? `${parseInt(dateParts[1])} / ${parseInt(dateParts[2])}` : `${orderInfo?.PaymentDate.split(" ")[0]}`}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>付款時間</div>
                                <div className='font-semibold'>{(timeParts && timeParts.length >= 3) ? `${timeParts[0]}:${timeParts[1]}` : `${orderInfo?.PaymentDate.split(" ")[1]}`}</div>
                            </div>
                        </div>
                        <div className='py-5 flex flex-col'>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>價格</div>
                                <div className='font-semibold'>{orderInfo?.TradeAmt}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>手續費</div>
                                <div className='font-semibold'>{orderInfo?.ChargeFee}</div>
                            </div>
                        </div>
                        <div className='py-5'>
                            <div className={`flex justify-between py-2 text-xl ${success ? 'text-green-500' : 'text-red-500'}`}>
                                <div className=' text-left'>
                                    總金額
                                </div>
                                <div className='text-right font-bold'>
                                    ＄{orderInfo?.TradeAmt + orderInfo?.ChargeFee}
                                </div>
                            </div>
                            <div className={`flex justify-between py-2 text-xl ${success ? 'text-green-500' : 'text-red-500'}`}>
                                <div className=' text-left'>
                                    訂單狀態
                                </div>
                                <div className='text-right font-bold'>
                                    {success ? '付款成功' : '付款失敗'}
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-left pt-5">
                            付款流程皆由第三方金流Funpoint提供，請安心使用。
                            <span className='text-slate-400 cursor-pointer underline' onClick={handlePrint}>
                                列印此頁
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteComponent;
