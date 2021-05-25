var map = [];
var map_aux = [];

const num_l = 20;
const num_c = 20;
const size_l = 32;
const size_c = 32;

var graphics;

var timing = 0;

class scene1 extends Phaser.Scene{
    
    constructor ()
    {
        super("scene1");
        this.pad = null;
    }
    
    preload ()
    {   
    }
    
    create ()
    {
        graphics = this.add.graphics();
        
        for (let i = 0; i < num_l; i++)
        {
            map.push([]);
            map_aux.push([]);
            for (let j = 0; j < num_c; j++)
            {
                map[i].push(0);
                map_aux[i].push(0);
            }
        }
        
        //map[0] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        //map[1] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[2] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[3] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[4] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[5] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[6] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[7] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[8] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[9] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[10] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[11] = [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0];
        map[16] = [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        
        for (let i = 0; i < num_l; i++)
        {
            for (let j = 0; j < num_c; j++)
            {
                map_aux[i][j] = map[i][j];
            }
        }
    }
    
    update ()
    {        
        if (timing == 0)
        {
            
            for (let i = 0; i < num_l; i++)
            {
                for (let j = 0; j < num_c; j++)
                {
                    if (map[i][j] == 0)
                    {
                        graphics.fillStyle(0xffff00, 1);
                        graphics.fillRect(j*size_c+1,i*size_l+1,size_c-2,size_l-2);
                    }
                    else if (map[i][j] == 1)
                    {
                        graphics.fillStyle(0xff00ff, 1);
                        graphics.fillRect(j*size_c+1,i*size_l+1,size_c-2,size_l-2);
                    }
                }
            }

            for (let i = 0; i < num_l; i++)
            {
                for (let j = 0; j < num_c; j++)
                {
                    //console.log("i =",i,"j =",j,"map[i][j] =",map[i][j]);
                    var compteur = 0;
                    for (let k = -1; k < 2; k++)
                    {
                        for (let l = -1; l < 2; l++)
                        {
                            var dep_ik = i+k;
                            var dep_jl = j+l;
                            if (dep_ik > num_l-1){dep_ik = 0}
                            else if (dep_ik < 0){dep_ik = num_l-1}
                            if (dep_jl > num_c-1){dep_jl = 0}
                            else if (dep_jl < 0){dep_jl = num_c-1}
                            //console.log("dep_ik =",dep_ik);
                            if ((k!=0 || l!=0) && map[dep_ik][dep_jl] == 1)
                            {
                                compteur += 1;
                            }
                        }
                    }
                    //console.log(compteur);
                    if (compteur == 3){map_aux[i][j] = 1;}
                    else if (compteur > 3 || compteur < 2){map_aux[i][j] = 0;}
                }
            }
            
            for (let i = 0; i < num_l; i++)
            {
                for (let j = 0; j < num_c; j++)
                {
                    map[i][j] = map_aux[i][j];
                }
            }
        }
        
        timing = (timing+1)%60;
    }
}