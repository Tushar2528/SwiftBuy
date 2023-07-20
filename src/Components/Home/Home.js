import { useState, useEffect, useRef } from "react";
import homeStyles from "./Home.module.css";
import { useParams } from "react-router-dom";
import {Circles } from "react-loader-spinner";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Import fireStore reference from frebaseInit file
import {db} from "../../firebaseinit";

//Import all the required functions from fireStore
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';

function Home(props) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 1, max: 150 });
  const [currentPriceRange, setCurrentPriceRange] = useState(priceRange);
  const [cartItems, setCartItems] = useState([]);
  const [itemsDB, setItemsDB] = useState([]);

  const {userid} = useParams();
  // console.log(userid);

  const search = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  // useEffect on load to fetch the items from the API

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setData(data);
      setFilteredData(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);


  // useEffect to show the filtered items as soon as the data changes on the screen

  useEffect(() => {
    const categoryFilteredData = data.filter((item) => {
      return selectedCategories.length === 0 || selectedCategories.includes(item.category);
    });
  
    const priceFilteredData = categoryFilteredData.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );
  
    setFilteredData(priceFilteredData);
  }, [selectedCategories, priceRange, data]);


    // function to add item to cart

  const addToCart = async (item) => {

    //getting the current state of cart items from Firestore
    try {
      const itemsRef = collection(db, `users/${userid}/cart`);
      const querySnapshot = await getDocs(itemsRef);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const index = items.findIndex((product) => product.id === item.id);
      
      // If the item is not present then add the document to the cart collection
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
      }
      
      // If the item is already present then update the qty filed by 1
      else {
        const collectionRef = collection(db, `users/${userid}/cart`);
        const itemRef = doc(collectionRef, querySnapshot.docs[index].id);
        await updateDoc(itemRef, { qty: items[index].qty + 1 });
        toast.success('Item Added To Cart', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }

      //Updating the local state of the cart items to render them on the screen
  
      const updatedCartItems = items.map((product) => {
        if (product.id === item.id) {
          return { ...product, qty: product.qty + 1 };
        }
        return product;
      });
  
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  
  
  
  // Function to search Items using the search bar
  function searchItem() {
    const searchTerm = search.current.value;

    const filteredItems = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredItems.length > 0) {
      setFilteredData(filteredItems);
    } else {
      setFilteredData([]);
    }
  }


  //handling the category change in the filter data checkboxes

  function handleCategoryChange(event){
    const category = event.target.value;

    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((c) => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  

    if (selectedCategories.length === 0){
        setFilteredData(data);
    }
  }

  function handlePriceRangeChange(event) {
    const [min, max] = event.target.value.split(",");
    setPriceRange({
      min: parseInt(min) || 1, // Set a default value of 1 if NaN
      max: parseInt(max) || 150, // Set a default value of 99999 if NaN
    });
  }
  

  return (
    <>
      <div className={homeStyles.homeContainer}>
        <div>
          <input
            type="text"
            ref={search}
            placeholder="Search..."
            onInput={searchItem} 
          />
        </div>
        <div className={homeStyles.mainContainer}>
          <aside className={homeStyles.filterContainer}>
            <div className={homeStyles.filter}>
                <h1>Filter</h1>
                <div className={homeStyles.priceRange}>
                <h2>Price Range</h2>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={`${priceRange.min}`}
                  onChange={handlePriceRangeChange}
                />
                <div className={homeStyles.priceLabels}>
                  <b><span >${priceRange.min}</span></b>
                  &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <b><span>${priceRange.max}</span></b>
                </div>
              </div>
            </div>
            <div className={homeStyles.category}>
                <div><h1>Category</h1></div>

                    <div>
                      <label>
                        <input
                        type="checkbox"
                        value="men's clothing"
                        checked={selectedCategories.includes("men's clothing")}
                        onChange={handleCategoryChange}
                        />
                        <div>Men's Clothing</div>
                      </label>
                    </div>
                    <div>
                      <label>
                          <input
                          type="checkbox"
                          value="women's clothing"
                          checked={selectedCategories.includes("women's clothing")}
                          onChange={handleCategoryChange}
                          />
                          <div>Women's Clothing</div>
                      </label>
                    </div>
                    <div>
                      <label>
                          <input
                          type="checkbox"
                          value="jewelery"
                          checked={selectedCategories.includes("jewelery")}
                          onChange={handleCategoryChange}
                          />
                          <div>Jewelry</div>
                      </label>
                    </div>
                    <div>
                      <label>
                          <input
                          type="checkbox"
                          value="electronics"
                          checked={selectedCategories.includes("electronics")}
                          onChange={handleCategoryChange}
                          />
                          <div>Electronics</div>
                      </label>
                    </div>

            </div>
          </aside>

          {isLoading ? (
                        <Circles 
                          type="TailSpin" // Specify the type of spinner/loader
                          color="#00BFFF" // Customize the color
                          height={50} // Specify the height of the spinner
                          width={50} // Specify the width of the spinner
                        />
                      ) :
          <div className={homeStyles.itemsContainer}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.id} className={homeStyles.item}>
                  <div className={homeStyles.itemImage}>
                    <img src={item.image} alt="img" />
                  </div>
                  <div className={homeStyles.itemDetails}>
                    <div>
                      <p>{item.title}</p>
                    </div>
                    <div>
                      <p>
                        <b>$ {item.price}</b>
                      </p>
                    </div>
                    <div>
                      <button onClick={() => addToCart(item)}>Add to cart</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={homeStyles.errormsg}><p ><h1>No Search results Found!!</h1></p></div>
            )}
          </div>
          }



        </div>
      </div>
    </>
  );
}

export { Home };


