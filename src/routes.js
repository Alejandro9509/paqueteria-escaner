import Scanner from "./Views/Scanner";
import iconoCarga from "./iconos/cargaIcono.png"
import iconoDescarga from "./iconos/descargaIcono.png"

const dashboardRoutes = [
    {
        name: "Carga",
        icon:iconoCarga,
        path: "/escaner/carga",
        component: Scanner
    },
    {
        name: "Descarga",
        icon: iconoDescarga,
        path: "/escaner/descarga",
        component: Scanner
    }

]

export default dashboardRoutes