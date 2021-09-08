//build
// const MAPSERVER = 'http://59.110.220.142:8091/cgi-bin/mapserv.exe?';
// const DATAFILENAME = 'http://59.110.220.142:80/egcDataFiles/';
//dev
const MAPSERVER = 'http://localhost:8091/cgi-bin/mapserv.exe?';
const DATAFILENAME = 'http://localhost:80/egcDataFiles/';
const MAPPINGAREANAME = 'mapping area ';
//=====================
//table const
const DATASETID = 'datasetId';
const SAMPLESEMANTIC = 'Samples';

const X = 'X';
const Y = 'Y';
// ===================
const ELLIPSE='ellipse';
const RECTANGLE='rectangle';
const USEDDATAFLAG = 1;
const GENERATEDDATAFLAG = 2;
const GENERATEDDATA = 'generatedData';
const USEDDATA = 'usedData';
//const HILLSLOPE_DELINEATION='hillslope_delineation';

//const SOILENVIRONMENT='SoilEnvironment';
//const MODELINGSAMPLES = 'ModelingSamples';

const SOILENVIRONMENT='Covariates';
const MODELINGSAMPLES = 'Soil_Samples';

const SOILPROPERTYFIELD ='SoilPropertyField';
const COVARIATESETTING ='Covariate_Setting';
const ENVRULES = 'EnvironmentalAttributeParameter';
const PATHSPLIT = '#';
const ENVSPLIT = '?';
const SUCCESS = 'success';
const HSM_SAMPLENAME = 'Species_Data';
const PATROLSAMPLENAME = 'Refined_Patrol_Data';
const VisitedSAMPLENAME = 'Representative_Citizen_Data';
const CameraSAMPLENAME = 'Camera/GPS_Data';
const HSM_ENVIRONMENTNAME = 'Covariates';
const QUERY_RESOLUTION = 0.001;

export const modelingConst ={
  MAPSERVER,
  DATAFILENAME,
  MAPPINGAREANAME,
  SAMPLESEMANTIC,
  X,Y,
  DATASETID,
  ELLIPSE,
  RECTANGLE,
  SOILENVIRONMENT,
  MODELINGSAMPLES,
  PATHSPLIT,
  SOILPROPERTYFIELD,
  ENVSPLIT,
  ENVRULES,
  USEDDATAFLAG,
  GENERATEDDATAFLAG,
  GENERATEDDATA,
  USEDDATA,
  SUCCESS,
  HSM_SAMPLENAME,
  PATROLSAMPLENAME,
  VisitedSAMPLENAME,
  CameraSAMPLENAME,
  HSM_ENVIRONMENTNAME,
  COVARIATESETTING,
  QUERY_RESOLUTION,
};
