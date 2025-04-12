import { CartItem, Product } from "@/assets/types";
import { createContext,PropsWithChildren,useContext, useState } from "react";
import {randomUUID} from 'expo-crypto'
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "@/api/order-items";

type CartType={
    items: CartItem[];
    favItems: Product[];
    addItem:(product:Product,size:CartItem['size'])=>void;
    updateQuantity:(itemId:string,amount:-1|1)=>void
    total:number,
    addFavItem:(product:Product)=>void
    deleteFavItem:(product:Product)=>void
    checkout:()=>void
}
const CartContext=createContext<CartType>({
    items:[],
    favItems:[],
    addItem:()=>{},
    updateQuantity:()=>{},
    total:0,
    addFavItem:()=>{},
    deleteFavItem:()=>{},
    checkout:()=>{}
})

const CartProvider=({children}:PropsWithChildren)=>{

    const [items,setItems]=useState<CartItem[]>([]);
    const [favItems,setFavItems]=useState<Product[]>([]);
    const {mutate:insertOrder}=useInsertOrder();
    const{mutate:insertOrderItems}=useInsertOrderItems()

    const router=useRouter()

    const addItem=(product:Product,size:CartItem['size'])=>{

        const existingItem=items.find(item=>item.product===product && item.size===size)
        if(existingItem){
            updateQuantity(existingItem.id,1)
            return
        }

        const newCartItem:CartItem={
            id: randomUUID(),
            product,
            product_id:product.id,
            size,
            quantity:1,
        }
        setItems([newCartItem, ...items])
    }

    const addFavItem=(product:Product)=>{
        const existingItem=favItems.find(item=>item===product)
        if(existingItem){
            return
        }
        setFavItems([product, ...favItems])
    }

    const deleteFavItem=(product:Product)=>{
        const updatedfavItems=favItems.filter(item=>item!=product)
        setFavItems(updatedfavItems)
    }
        
    const updateQuantity=(itemId:string,amount:-1|1)=>{
        const updatedItems=items.map(item=>item.id!=itemId?item:{...item,quantity:item.quantity+amount})
        const updatedItems2=updatedItems.filter(item=>item.quantity>0)
        setItems(updatedItems2)
    }

    const total=items.reduce((acc,item)=>acc+item.product.price*item.quantity,0)

    const clearCart=()=>{
        setItems([]);
    }

    const checkout=()=>{
        insertOrder({total},{onSuccess:saveOrderItems
        })
    };

    const saveOrderItems = (order: any) => {
        const orderItems = items.map((cartItem) => ({
          order_id: order.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          size: cartItem.size,
        }));
    
        insertOrderItems(orderItems, {
          onSuccess() {
            clearCart();
            router.push(`/(user)/orders/`);
          },
        });
      };

    return (
        <CartContext.Provider value={{
            items, addItem, updateQuantity,total,addFavItem,favItems, deleteFavItem,checkout
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider

export const useCart=()=>useContext(CartContext)