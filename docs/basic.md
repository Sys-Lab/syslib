# Basic usage

<a href="http://sys-lab.github.io/syslib" target="_blank">Doc Index</a>


#__Model

The core part is the __Model.

a view is made up by some models in different status.

Use 

__Model.add(name,html,required,initfunc,attrs,father,formats);

to add a model;

name - Model's name
html - Model's template
required - Model required other Models's [will auto include]
initfunc - init function called once Model is added and appended to dom
attrs - attributes added to Model's dom element
father - Model's father default is #sys_main_playground
formats - formats array used by template


Once Model is added . you can now add statue to the Model;

Use

__Model.t  [shoutcut:  _m]

__Model.t(name).addstatue(stname,stfunc,required,delyloadme)

to add a statue to model

stname - statue's name
stfunc - statue's function called once model changed to this statue
required - statue required [will auto include]


Use

__Model.t(name).to(stname)

to chage to that statue

name - Model's name
stname - statue's name


Use 

__Model.t(name).rebuild()

to rebuild (reinit) the model


more on <a href="http://sys-lab.github.io/syslib" target="_blank">reference</a>






