import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebaseinit";
import { collection, getDocs} from "firebase/firestore";
import orderStyles from "./Orders.module.css";
import {Circles } from "react-loader-spinner";


function Orders(){

    const {userid} = useParams();
    const [orders, setOrders] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);


    //useEffect to fetch the current status of orders from the Firestore and render on the screen

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const ordersCollectionRef = collection(db, `users/${userid}/orders`);
            const querySnapshot = await getDocs(ordersCollectionRef);
            const ordersData = querySnapshot.docs.map((doc) => doc.data());
            setOrders(ordersData);
            setIsLoading(false);
            console.log("Orders are : ", ordersData);
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };
      
        fetchOrders();
      }, [userid]);

      
      return (
        <>
          <div className={orderStyles.mainContainer}>
            <h1>Your Orders</h1>

            {isLoading ? (
                        <Circles className={orderStyles.loader}
                          type="TailSpin" // Specify the type of spinner/loader
                          color="#00BFFF" // Customize the color
                          height={50} // Specify the height of the spinner
                          width={50} // Specify the width of the spinner
                        />
                      ) : 

                          <>{
                            orders.length > 0 ?
                              <>{orders.map((order, index) => (
                                <div key={index} className={orderStyles.order}>
                                  <div className={orderStyles.orderCard}>
                                    <table className={orderStyles.orderTable}>
                                      <thead>
                                        <tr>
                                          <th>Title</th>
                                          <th>Price</th>
                                          <th>Quantity</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {order.order.map((item, index) => (
                                          <tr key={index}>
                                            <td>{item.title}</td>
                                            <td>$ {item.price}</td>
                                            <td>{item.qty}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className={orderStyles.totalprice}>
                                    <p>Total Price:</p>
                                    <p>$ {order.total}</p>
                                  </div>
                                </div>
                              ))}</> 
                              : <h1>No orders yet!!</h1>
                          }</>
            } 



          </div>
        </>
      );







}

export {Orders};





