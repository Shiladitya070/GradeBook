

import ListOfClass from '../../components/ListOfClass';
import CreateClass from '../../components/CreateClass';

function Teacher() {

  return (
    <div>
      <CreateClass />
      <ListOfClass teacher={{ id: "test", name: 'Das' }} />
    </div>
  )
}

export default Teacher