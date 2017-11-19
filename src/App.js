import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
import $ from 'jquery';
import 'whatwg-fetch';

class App extends React.Component {

constructor(props){
  super(props);
  this.state = {
    loading: false,
    finished: false,
    stepIndex: 0,
    pictures: {},
    accno:'',
    aadhaar:'',
    profilepic:'',
    file:"",
    name:"",
    error:"",
    message:""
  };
}

  submitForm=()=>{
    if(this.state.aadhaar.length!==12&&this.state.accno.length!==11&&this.state.name!==''){
      console.log('hey');
      this.setState({
        error:'Please check. Aadhaar Card Number should be 12 digits and Account Number to be 11 digits.'
      })
      return;
    }
    let self =this;
    let form = new FormData();
    console.log(this.state.file);
    form.append('name', this.state.name);
    form.append('acc_no', this.state.accno);
    form.append('aadhar_card', this.state.aadhaar);
    form.append('image', this.state.file);
    fetch('http://139.59.73.1:8000/upload', {
          method:'POST',
          body:form,
          'headers': {
          'contentType': 'multipart/form-data',
        }})
        .then(function(response){
          console.log(response);
          self.setState({
            message:'Your details were succesfully submitted!',
            error:''
          })
          return response.json();
        }).then(function(json){
          console.log(json);
          self.setState({
            message:json.message,
            error:''
          })
        }).catch(function(response){
          console.log(response);
          console.log('error');
          self.setState({
            error:'There was some error submitting your details',
            message:''
          })
        });
  }
  handleInput=(event)=>{
    const value = event.target.value;
    if(event.target.name==='accno'){
      this.setState({
        accno:event.target.value
      })
    }
    else if(event.target.name==='aadhaar'){
      this.setState({
        aadhaar:event.target.value
      })
    }
    else if(event.target.name==='name'){
      this.setState({
        name:event.target.value
      })
    }
  }
  onChange = (pictures) => this.setState({pictures});
  onFileChange=(event)=>{
    let file = event.target.files[0];
    /*if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
    }*/
    console.log(file);
    this.setState({
        file:file
    });
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
          loading: false,
          stepIndex: stepIndex + 1,
          finished: stepIndex >= 2,
        });
  };
  componentDidMount(){
   this.nameInput.focus();
 }
  handlePrev = () => {
    const {stepIndex} = this.state;
    this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      });
  };

  getStepContent(stepIndex) {
    const blueColor = {color:'#1A237E','fill':'#1A237E'}
    switch (stepIndex) {
      case 0:
        return (
          <span className="flex">
            <div className="left">
              <input name="name"
              onChange={this.handleInput}
              value={this.state.name}
              ref={(input) => { this.nameInput = input; }}
              type="text" placeholder="Enter Name" className="customInputField" />
              <input name="aadhaar"
              onChange={this.handleInput}
              value={this.state.aadhaar}
              type="text" placeholder="Enter 12 digit Aadhaar Number." className="customInputField" />
            </div>
            <div className="right">
              <img src="id-card.png" alt="id-card" />
            </div>
          </span>
        );
      case 1:
        return (
          <span className="flex">
            <div className="left">
              <input name="accno"
              onChange={this.handleInput}
              value={this.state.accno}
              type="text" placeholder="Enter digit SBI Account Number." className="customInputField" />
            </div>
            <div className="right">
              <img src="safebox.png" alt="safebox" />
            </div>
          </span>
        );
      case 2:
        return (
          <span className="flex">
            <div className="left">
              <h2>Upload your recent photo.</h2>

            <form encType="multipart/form-data" action="http://apiplatformcloudse-gseapicssbisecond-uqlpluu8.srv.ravcloud.com:8001/FaceRecogCreate"
            method="POST" ref="form">
              <input type="file" name='user[image]' onChange={this.onFileChange}
                ref={(c) => { this.file = c; }} />
              <input type="hidden" name='name' value={this.state.name} className='hidden'/>

              <input type="hidden" name='acc_no' value={this.state.accno} className='hidden'/>
              <input type="hidden" name='aadhar_card' value={this.state.aadhaar} className='hidden'/>
            </form>
            </div>
            <div className="right">
              <img src="yearbook.png" alt="yearbook" />
            </div>
          </span>
        );
      default:
        return 'Please complete all steps!';
    }
  }

  renderContent() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};

    if (finished) {
      return (
        <div style={contentStyle}>
            {this.state.error!==''?<h3>{this.state.error}</h3>:''}
            <RaisedButton
              primary={true}
              className="button"
              backgroundColor="#1976D2"
                label="Back"
                disabled={stepIndex === 0}
                onClick={this.handlePrev}
                style={{marginRight: 12}}
            />
            <RaisedButton
              primary={true}
              label="Submit"
              className="button"
              backgroundColor="#1976D2"
              onClick={this.submitForm}
            />

            {this.state.message!==''?<h3>{this.state.message}</h3>:''}
          {/*<p className="error">{this.state.error}</p>
          <a href="" className="link" onClick={this.submitForm}>Submit</a>*/}
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onClick={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            className="button"
            backgroundColor="#1976D2"
            onClick={this.handleNext}
          />
        </div>
      </div>
    );
  }

  render() {


    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper style={{'color':'#1976D2'}} activeStep={this.state.stepIndex}>
          <Step style={{'color':'#1976D2'}}>
            <StepLabel iconContainerStyle={{'color':'#1976D2'}}>Enter Aadhar Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Enter Account Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Upload your photo.</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={this.state.loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    );
  }
}

export default App;
