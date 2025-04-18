import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
// import { boolean } from "yup";

type authcontext={
    session: Session|null
    loading:boolean
    profile:any
    isAdmin:boolean
};

const AuthContext=createContext<authcontext>({
    session:null,
    loading:true,
    profile:null,
    isAdmin:false
});

export default function AuthProvider({children}:PropsWithChildren){
    const [session,setSession]=useState<Session|null>(null);
    const [loading,setLoading]=useState<boolean>(true);
    const [profile,setProfile]=useState(null);

    useEffect(()=>{
        
        const fetchSession=async()=>{
           const {data:{session}} =await supabase.auth.getSession();
           setSession(session);

           if (session) {
            // fetch profile
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id',session.user.id)
              .single();
            setProfile(data || null);
          }
            setLoading(false);
        }
        
        
        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
          });
    },[])

    console.log(profile);

    return <AuthContext.Provider value={{session,loading,profile,isAdmin:profile?.group==="ADMIN"}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth=()=>useContext(AuthContext);