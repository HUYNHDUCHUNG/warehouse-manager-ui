import InfoUser from './_components/info-user'
import Navbar from './_components/navbar'
import Sidebar from './_components/sidebar'
const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
      <div className='h-full w-56 flex-col fixed z-50'>
        <Sidebar />
      </div>
      <div className='h-[56px] w-[calc(100%-14rem)] ms-56 sticky top-0'>
        <Navbar>
          <InfoUser />
        </Navbar>
      </div>
      <main className='h-full min-h-[calc(100vh-56px)] w-[calc(100%-14rem)] ms-56 px-4 py-6 bg-[#f3f3f9]'>
        {children}
      </main>
    </div>
  )
}
export default Dashboard
