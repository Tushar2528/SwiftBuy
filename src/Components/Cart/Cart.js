import cartStyles from "./Cart.module.css";
import plus from "../../Images/plus.png";
import minus from "../../Images/minus.png";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Circles } from "react-loader-spinner";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../../firebaseinit";
import { collection, getDocs, doc, deleteDoc, updateDoc, onSnapshot, addDoc } from "firebase/firestore";

function Cart(props){

    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { userid } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    console.log(cartItems);

    // useEffect to load the cart items from Firestore as sson as the cart component is rendered and on every update
  
    useEffect(() => {
        const collectionRef = collection(db, `users/${userid}/cart`);
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCart(items);
          setIsLoading(false);
          console.log(items);
          
        });
            return () => unsubscribe();
      }, [userid]);
      

    useEffect(() => {
        // Calculate total price whenever cart items change
        calculateTotalPrice();
    });

    

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cart.forEach((item) => {
            totalPrice += item.price * item.qty;
        });
        setTotalPrice(totalPrice.toFixed(2));
    };


    //Function to increment the qty field of cart items inside the cart component

    const increment = async (item) => {
        try {
          const itemsRef = collection(db, `users/${userid}/cart`);
          const querySnapshot = await getDocs(itemsRef);
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          const index = items.findIndex((product) => product.id === item.id);
      
          if (index === -1) {
            const collectionRef = collection(db, `users/${userid}/cart`);
            const newCartItem = {
              ...item,
              qty: 1,
            };
            await addDoc(collectionRef, newCartItem);
            toast.success('Item Added To Cart', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
              });
          } else {
            const collectionRef = collection(db, `users/${userid}/cart`);
            const itemRef = doc(collectionRef, querySnapshot.docs[index].id);
            await updateDoc(itemRef, { qty: items[index].qty + 1 });
            toast.success('Item Added To Cart', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
              });
          }
      
          const updatedCartItems = items.map((product) => {
            if (product.id === item.id) {
              return { ...product, qty: product.qty + 1 };
            }
            return product;
          });
      
          setCartItems(updatedCartItems);
        } catch (error) {
          
        }
      };


      //Function to decrement/ remove the qty/item from the cart

      const decrement = async (item) => {
        try {
          const itemsRef = collection(db, `users/${userid}/cart`);
          const querySnapshot = await getDocs(itemsRef);
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          const index = items.findIndex((product) => product.id === item.id);
      
          if (index !== -1) {
            const collectionRef = collection(db, `users/${userid}/cart`);
            const itemRef = doc(collectionRef, querySnapshot.docs[index].id);
      
            if (items[index].qty > 1) {
              await updateDoc(itemRef, { qty: items[index].qty - 1 });
              toast.error('Item Removed From cart', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
              });
      
              const updatedCartItems = items.map((product) => {
                if (product.id === item.id) {
                  return { ...product, qty: product.qty - 1 };
                }
                return product;
              });
      
              setCartItems(updatedCartItems);
            } else {
              await deleteDoc(itemRef);
              toast.error('Item Removed From cart', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
              });
      
      
              const updatedCartItems = items.filter((product) => product.id !== item.id);
      
              setCartItems(updatedCartItems);
            }
          }
        } catch (error) {
          
        }
      };
      
      

    //function to navigate to the orders page and clear the cart as the order has been placed

    const gotoOrders = async () => {
        try {

            let total = 0;

            cart.forEach((item) =>{
                total +=item.price;
            })

            const ordersCollectionRef = collection(db, `users/${userid}/orders`);
            await addDoc(ordersCollectionRef, { order : cart, total : total.toFixed(2)  });


            const cartCollectionRef = collection(db, `users/${userid}/cart`);
            const snapshot = await getDocs(cartCollectionRef);

           
            const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
            console.log("Sanpshot docs : ", snapshot.docs);
            await Promise.all(deletePromises);


            navigate(`/${userid}/orders`);
        } catch (error) {
          
        }
      };


      //function to remove an item entirely from the cart

      async function removeFromCart(item) {
        try {

            console.log(item);
            const itemsRef = collection(db, `users/${userid}/cart/`);
            const snapshot = await getDocs(itemsRef);
            

            snapshot.docs.forEach((doc) => {
              if (doc.data().id === item.id) {
                deleteDoc(doc.ref);
              }
            })
            
        // Update the cart state by filtering out the removed item
          setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
        } catch (error) {
          
        }
      }
        
    


   


    return (
        <>
            <div className={cartStyles.mainContainer}>
                <aside className={cartStyles.total}>
                    <div><h1>Total Price: $  {totalPrice}</h1></div>
                    <div>
                        <button className={cartStyles.purchase} onClick={gotoOrders}>Purchase</button>
                    </div>

                </aside>
                <div className={cartStyles.cartContainer}>

                    {isLoading ? (
                        <Circles 
                          type="Circles" // Specify the type of spinner/loader
                          color="#00BFFF" // Customize the color
                          height={50} // Specify the height of the spinner
                          width={50} // Specify the width of the spinner
                        />
                      ) : 

                    <>{cart.length > 0 ?
                    <>{cart.map((item) => {
                        return (
                            <div className={cartStyles.cartItem}>
                                <div className={cartStyles.itemImage}>
                                    <img src={item.image} alt=""></img>
                                </div>
                                <div className={cartStyles.itemDetails}>
                                    <div>
                                        <p>{item.title}</p>
                                    </div>
                                    <div className={cartStyles.price}>
                                        <div><h3>$ {item.price}</h3></div>
                                        <div className={cartStyles.buttons}>
                                            <img src={plus} alt="" onClick={() =>increment(item)}></img>
                                            <p>{item.qty}</p>
                                            <img  src={minus} alt="" onClick={()=> decrement(item)}></img>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        <button onClick={() => removeFromCart(item)} className={cartStyles.remove}>Remove from cart</button>
                                    </div>
                                </div>

                    </div>

                        )
                    })}</> : <h1>Your cart is empty!!</h1>}</>
                }

                </div>
            </div>
        </>
    )
}

export {Cart};