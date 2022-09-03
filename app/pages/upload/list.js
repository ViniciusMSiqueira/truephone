import { useRouter } from "next/dist/client/router";

export default function List({ data }){

    const router = useRouter();

    const uploadData = () =>  {
        fetch("http://localhost:3080/uploads/db", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                console.log("Uploading data to db!");
                router.push('/');
            })
            .catch((error) => {
                console.warn(error);
            })
    }



    return (
        <div className="content">
            <div className="container">
                <table className="table text-white">
                    <thead>
                        <tr> 
                            <th scope="col">#</th>
                            <th scope="col">Telefone</th>
                            <th scope="col">Mensagem</th>
                            <th scope="col">Validez</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, i) => (
                            <tr key={i}>
                                <th scope="row">{i}</th>
                                <td>{item.Telefone}</td>
                                <td>{item.Mensagem}</td>
                                <td>{item.Validez.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mx-auto text-center align-items-center">
                <button className="btn btn-primary" onClick={uploadData}>
                        Enviar dados para Banco de dados!
                    </button>
            </div> 
        </div>
    );

};

export async function getServerSideProps() {
    const res = await fetch('http://localhost:3080/uploads/payload')
    const data = await res.json()

    return { props: { data } }
}
