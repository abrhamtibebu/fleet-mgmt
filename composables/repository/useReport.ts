// composables/useReport.ts
import { ref } from 'vue'

interface DashboardReport {
  serviceDue: number
  openNotifications: number
  fuelTrends: Array<{ ym: string; total: number }>
  vehicleStatus: Array<{ status: number; total: number }>
  costBreakdown: { fuel: number; maintenance: number; other: number }
  vehiclePerformance: Array<{
    vehicleId: number    
    avg_km_per_l: number
    vehicleData: {
      plateNo: string
      fuelEfficiency: number
    }
  }>
}

interface User{
  name: string,
  id: string
}

export const useReport = () => {
  const { $apiFetch } = useNuxtApp();
  const dashboardReport = ref<DashboardReport | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const usersList = ref<User[]>([])
  const vehicleList = ref<DashboardReport[]>([])    
  const travelList = ref<DashboardReport[]>([]) 

  
  

  const getAllReport = async (from: string, to: string) => {
    loading.value = true
    try {
      const data = await $apiFetch(`/report/dashboard/${from}/${to}`, {
        method: "GET"
      });
      dashboardReport.value = data.result
    } catch (e) {
      dashboardReport.value = null
      error.value = 'Failed to fetch dashboard report'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  const getAnalyticsReportt= async (from: string, to: string) => {
    loading.value = true
    try {
      const data = await $apiFetch(`/report/analytics/${from}/${to}`, {
        method: "GET"
      });
      dashboardReport.value = data.result
    } catch (e) {
      dashboardReport.value = null
      error.value = 'Failed to fetch dashboard report'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  const getVehicles = async () => {
    loading.value = true
    try {

      const data = await $apiFetch<Vehicle>("/vehicle/all", {
        method: "GET"
      });
      vehicleList.value = Array.isArray(data.result) ? data.result : []
    
    } catch (e) {
      vehicleList.value = []
      error.value = 'Failed to fetch vehicles'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  //user list
  const getUsers = async () => {
    try {
      const data = await $apiFetch<{ result: any[] }>('/user/all', {
        method: 'GET'
      })
      usersList.value = Array.isArray(data.result) ? data.result : []
      
      return data.result;
    } catch (e) {
      console.error(e)
    } finally {
    }
  }
  // Request Reavel
//    const useRequestTravel = () => {
//  // const baseURL = 'http://localhost:8000/api' // adjust to your backend URL

//   const requestTravel = async (data) => {
//     const { data: res, error } = await $apiFetch(`/report/analytics/travel-requests`, {
//       method: 'POST',
//       body: data,
//     })
//     if (error.value) throw error.value
//     return res.value
//   }}
//  const useRequestTravel = () => {
//   const requestTravel = async (data) => {
//     const { data: res, error } = await $apiFetch(`/vehicle/travelreq`, {
//       method: 'POST',
//       body: data,
//     })
//     if (error.value) throw error.value
    
//     return res.value
//   }

//   return { requestTravel } // ✅ important
// }



const useRequestTravel = () => {
  const requestTravel = async (data) => {
    try {
      const res = await $apiFetch(`/vehicle/travelreq`, {
        method: 'POST',
        body: data,
      });

      return res; // ✅ return the whole response, not res.value
    } catch (err) {
      throw new Error(err?.message || 'Failed to create travel request');
    }
  };

  return { requestTravel };
};


 const requestTravel = async (payload: any) => {
    const { data, error } = await $apiFetch(`/report/analytics/travel-requests`, {
      method: 'POST',
      body: payload
    })

    if (error?.value) throw error.value
    return data?.value
  }

  //Get Travel Requests - Corrected version



// const getTravelRequests = async () => {
//   try {
//     const res = await $apiFetch(`/vehicle/travelreq`, {
//       method: 'GET'
//     })
//      travelList.value = Array.isArray(data.result) ? data.result : []


//     console.log("TTO", res)

//     // backend returns { status: "OK", result: [...] }
//     return res?.result ?? []
    
//   } catch (err) {
//     console.error("GET Travel Requests Error:", err)
//     return []
//   }
// }
// const getTravelRequests = async () => {
//   try {
//     const res = await $apiFetch(`/vehicle/travelreq`, {
//       method: 'GET'
//     });

//     console.log("GET travel req:", res);

//     // FIX 1: Always use res.result
//     const list = Array.isArray(res?.result) ? res.result : [];

//     // FIX 2: Convert "route" string → array
//     list.forEach(item => {
//       try {
//         item.route = JSON.parse(item.route);  // "[test]" → ["test"]
//       } catch {
//         item.route = [];  // fallback
//       }
//     });

//     travelList.value = list;
//     return list;

//   } catch (err) {
//     console.error("GET Travel Requests Error:", err);
//     return [];
//   }
// };
const getTravelRequests = async () => {
  try {
    const res = await $apiFetch(`/vehicle/travelreq`, { method: "GET" });

    const list = res?.result ?? [];

    list.forEach(item => {
      // ===========================
      // FIX ROUTE: "[test]" → ["test"]
      // ===========================
      if (typeof item.route === "string") {
        let cleanRoute = item.route
          .replace(/^\[/, "")   // remove first [
          .replace(/\]$/, "");  // remove last ]

        // split by comma, trim spaces
        item.route = cleanRoute
          ? cleanRoute.split(",").map(r => r.trim())
          : [];
      }

      // ===========================
      // FIX TRAVELERS: "[id1, id2]" → ["id1","id2"]
      // ===========================
      if (typeof item.travelers === "string") {
        let cleanTravelers = item.travelers
          .replace(/^\[/, "")
          .replace(/\]$/, "");

        item.travelers = cleanTravelers
          ? cleanTravelers.split(",").map(id => id.trim())
          : [];
      }
    });

    return list;
  } catch (err) {
    console.error("GET Travel Requests Error:", err);
    return [];
  }
};

 const vehicleAssignedPerDay = async ( vehicleId: any, date : any) => {
    return await $apiFetch(`/vehicle/assignedhistory/${vehicleId}/${date}`, {
      method: 'GET'
    })
  }

  const approveTravelRequest = async ( reqId: any,status: any ,  payload: any) => {
    return await $apiFetch(`/vehicle/${reqId}/travelreq/${status}`, {
      method: 'PUT',
      body: payload,
    })
  }

  const rejectTravelRequest = async ( reqId: any, status: any , payload: any ) => {
    return await $apiFetch(`/vehicle/${reqId}/travelreq/${status}`, {
      method: 'PUT',
          body: payload,


    })
  }
   const cancelTravelRequest = async (  reqId: any , status: any , payload: any ) => {
    return await $apiFetch(`/vehicle/${reqId}/travelreq/${status}`, {
      method: 'PUT',
     body: payload,

    })
  }

  const updateTravelStatus = async (id: any, status: any , reqId: any) => {
    const { data, error } = await $apiFetch(`/vehicle/${reqId}/travelreq/${status}`, {
      method: 'PUT',
      body: { status }
    })

    if (error?.value) throw error.value
    return data?.value
  }

//edit the status of the travel that change it to the 
 const useReportRepository = () => {
  const updateTravelStatus = async (id, status) => {
    const { data, error } = await $apiFetch(`/vehicle/{reqId}/travelreq/${status}`, {
      method: 'PUT',
      body: { status },
    })
    if (error.value) throw error.value
    return data.value
  }

  return {
    updateTravelStatus,
    // ... other repository functions
  }
}
// Get Travel Request
//  const useTravelRequests = () => {

//   const getTravelRequests = async () => {
//     const { data, error } = await $apiFetch(`/vehicle/travelreq`)
//     if (error.value) throw error.value
//     return data.value
//   }

//   const approveTravelRequest = async (id: number) => {
//     await $apiFetch(`/vehicle/{reqId}/travelreq/${status}`, { method: 'PUT' })
//   }

//   const rejectTravelRequest = async (id: number) => {
//     await $apiFetch(`/vehicle/{reqId}/travelreq/${status}`, { method: 'PUT' })
//   }

//   return { getTravelRequests, approveTravelRequest, rejectTravelRequest }
// }

  // In your useReport composable
const getAnalyticsReport = async (from: string, to: string) => {
  loading.value = true
  try {
    console.log('Making API call to:', `/report/analytics/${from}/${to}`)
    const data = await $apiFetch(`/report/analytics/${from}/${to}`, {
      method: "GET"
    });
    
    console.log('API Response:', data)
    dashboardReport.value = data
    
    // If the API returns {status: "OK", result: {...}}, we need to access data.result
    if (data.status === "OK" && data.result) {
      dashboardReport.value = data.result
      console.log('Set dashboardReport to result:', dashboardReport.value)
    }
  } catch (e) {
    console.error('API Error:', e)
    dashboardReport.value = null
    error.value = 'Failed to fetch dashboard report'
  } finally {
    loading.value = false
  }
}

  return {
    dashboardReport,
    loading,
    error,
    getAllReport,
    getAnalyticsReport,
     useRequestTravel,
    getUsers,
    usersList,
    // useTravelRequests,
    useReportRepository,
     requestTravel,
    getTravelRequests,
    approveTravelRequest,
    rejectTravelRequest,
    updateTravelStatus,
    getVehicles,
    vehicleList,
    travelList,
    cancelTravelRequest,
    vehicleAssignedPerDay,
    

  
  }
}