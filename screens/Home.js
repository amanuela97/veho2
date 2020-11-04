import React from 'react';
import { Container, Content,Text, Button} from 'native-base';

const Home = (props) =>{

    return(
      <Container>
          <Content style={{marginTop: '50%'}}>
              <Text style={{alignSelf: 'center'}}>HOME</Text>
              <Button Text='Logout'/>
          </Content>
      </Container>  
    );
};

export default Home;