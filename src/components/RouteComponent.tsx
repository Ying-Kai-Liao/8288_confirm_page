// RouteComponent.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentSuccessAnimation from './PaymentSuccess';

const RouteComponent = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const merchantTradeNo = queryParams.get('MerchantTradeNo');
    console.log(merchantTradeNo);

    const [responseData, setResponseData] = useState<any>(null);
    const [success, setSuccess] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>(null)

    const handlePrint = () => {
        window.print();
    };

    const fetchData = async () => {
        try {
            const url = 'https://8288girl.com/wp-json/api/check_pay_ready';
            const requestData = {
                MerchantTradeNo: merchantTradeNo
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data: any = await response.json(); 
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

    const handleClick = () => {
        if(success) {
            return window.location.href="https://8288girl.com"
        }
        return window.location.href="https://8288girl.com/checkout"
    }

    const dateParts = orderInfo?.PaymentDate.split(" ")[0]?.split("/");
    const timeParts = orderInfo?.PaymentDate.split(" ")[1]?.split(":");

    type PaymentDetailsProps = {
        paymentType: string;
        Info: any; 
        Bank?: boolean;
        AccountNo?: boolean;
      };
      
    function PaymentDetails({ paymentType, Info, Bank = false, AccountNo = false }: PaymentDetailsProps) {
        if (paymentType === "CVS") {
          const store = Info?.PayFrom === "family" ? '全家' : Info?.PayFrom === "ibon" ? '統一超商' : '無資料'
          const location = decodeURIComponent(Info?.StoreName)
          return (
            <div>{store} {location}</div>
          );
        }

        return (
          <div></div>
        );
      }      
    
      function ATMPaymentDetails({ paymentType, Info, Bank = false, AccountNo = false }: PaymentDetailsProps) {
        if (paymentType === "ATM") {
            const bank = Info?.ATMAccBank === '822' ? '中國信託 822' : Info?.ATMAccBank === '007' ? '第一銀行' : Info?.ATMAccBank
            const No = Info?.ATMAccNo
            return (
              <div>
                {Bank && bank}{AccountNo && No}
              </div>
            )
        }

        return (
          <div></div>
        );
      }      

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
        <div className='flex items-center justify-center flex-col'>
            <div className='flex items-center justify-center flex-col' id='card'>
                <PaymentSuccessAnimation success={success} />
                <div className='flex flex-col text-center rounded-[20px] bg-white max-w-[500px] mx-5 md:w-[500px] shadow-lg'>
                    <div className='p-4 rounded-[20px] m-4 mt-20'>
                        <div className='text-[20px] font-semibold'>
                            {success ? '付款成功' : '付款失敗'}
                        </div>
                        <div className='text-[30px] font-semibold'>
                            {orderInfo?.TradeAmt}元
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
                                <div className='font-semibold'>{orderInfo?.item_name}</div>
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
                                <div className='pb-2 text-stone-400'>付款方式</div>
                                <div className='font-semibold'>
                                    {responseData?.CardInfo && '信用卡'}
                                    {responseData?.CVSInfo && '超商繳費'}
                                    {responseData?.ATMInfo && 'ATM繳費'}
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>
                                    {orderInfo?.PaymentType === "ATM" && '銀行'}
                                </div>
                                <div className='font-semibold'>
                                    <ATMPaymentDetails paymentType={orderInfo?.PaymentType} Info={responseData?.ATMInfo} Bank />
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='pb-2 text-stone-400'>
                                    {orderInfo?.PaymentType === "CVS" && '繳費地點'}
                                    {orderInfo?.PaymentType === "Credit" && '卡號'}
                                    {orderInfo?.PaymentType === "ATM" && '轉帳末五碼'}
                                </div>
                                <div className='font-semibold'>
                                    <PaymentDetails paymentType={orderInfo?.PaymentType} Info={responseData?.CVSInfo} />
                                    {orderInfo?.PaymentType === "Credit" && `${responseData?.CardInfo.Card6No}******${responseData?.CardInfo.Card4No}`}
                                    <ATMPaymentDetails paymentType={orderInfo?.PaymentType} Info={responseData?.ATMInfo} AccountNo />
                                </div>
                            </div>
                        </div>
                        <div className='py-5'>
                            <div className={`flex justify-between py-2 text-xl ${success ? 'text-green-500' : 'text-red-500'}`}>
                                <div className=' text-left'>
                                    總金額
                                </div>
                                <div className='text-right font-bold'>
                                    ＄{orderInfo?.TradeAmt}
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
            <div className='flex flex-row justify-center md:w-[400px] max-w-[400px]'>
                <div className='justify-center text-white hover:text-purple-800
                  text-center text-lg font-semibold mt-10 bg-[#120123] transition-all duration-300
                  hover:bg-white p-6 w-32 cursor-pointer rounded-[16px] shadow-lg'
                  onClick={handleClick}
                >
                    <span>{success && `返回首頁`}</span>
                    <span>{!success && `返回結帳`}</span>
                </div>
            </div>
        </div>
    );
};

export default RouteComponent;