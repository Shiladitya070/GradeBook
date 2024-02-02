
import CreateClass from '@/components/CreateClass';
import ListOfClass from '@/components/ListOfClass';

function Teacher() {

  return (
    <div>
      <CreateClass />
      <ListOfClass teacher={{ id: "test", name: 'Das' }} />
    </div>
  )
}

export default Teacher