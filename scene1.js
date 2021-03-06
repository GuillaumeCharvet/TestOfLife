var map = [];
var map_aux = [];

var graphics;
var scoreText;
var reserveText;
var reserveText2;
var scoreFinalText;
var helpText;

var cursors;

var timing = 0;
var timing2 = 0;

var pause = false;
var pause_possible = false;

var color = 1;
var switch_color_possible = false;
var size_radius_init = 1;
var size_radius = size_radius_init;
var reserve_mouse = 180;
var reserve_mouse2 = 5;

var mouse_possible = false;
var radius_up_possible = false;
var radius_down_possible = false;
var mode_dessin = 1;
var switch_mode_dessin_possible = false;
var rotate_left_possible = false;
var rotate_right_possible = false;

var compteur_cases_non_vides;

var scoreMax = 0;
var nb_tour_var_max_max = 100;
var nb_tour_var_max;

var palette_couleur;

/************************ TEST **********************/

var nb_trait;
var x_start;
var y_start;
var i_start;
var j_start;
var theta;
var length_trait;
var d;

/************** PARAMETRES MODIFIABLES **************/

const num_l = 150;
const num_c = 150;
const size_l = 5;
const size_c = 5;

const lim_display_grid = 13;
var angle_display = 0;

var decalage_diag = angle_display?1:0;

const mode_score = false;
const random_start = false;//mode_score;

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
        
        if (angle_display == 0){decalage_diag = 0;}
        else {decalage_diag = 1;}
        
        //this.cameras.main.setScroll(-num_l*(angle_display+decalage_diag)-0.02*(num_c * (size_c+angle_display) + num_l * (angle_display+decalage_diag)),-70);
        //this.cameras.main.setScroll(0,-70);
        this.cameras.main.setScroll(-(num_l * (angle_display + decalage_diag) + 70),-70);

        if (mode_score)
        {
            scoreText = this.add.text(16 +40, 16,"", {
                fontSize: '18px',
                padding: { x: 10, y: 5 },
                fill: '#ffffff'
            }).setScrollFactor(0);

            reserveText= this.add.text(config.width - 330-110, config.height - 66,"reserve longueur clic = "+reserve_mouse, {
                fontSize: '18px',
                padding: { x: 10, y: 5 },
                fill: '#ffffff'
            }).setScrollFactor(0);

            reserveText2= this.add.text(config.width - 330-110, config.height - 36,"reserve nombre clic = "+reserve_mouse2, {
                fontSize: '18px',
                padding: { x: 10, y: 5 },
                fill: '#ffffff'
            }).setScrollFactor(0);
        }
        
        helpText= this.add.text(300, config.height/2,"M = taille brush moins grande \n P = taille brush plus grande \n B = mode brush "+mode_dessin+"\n C = couleur "+color*2-1, {
                fontSize: '18px',
                padding: { x: 10, y: 5 },
                fill: '#ffffff'
            }).setScrollFactor(0);
        
        cursors = this.input.keyboard.addKeys({ 'pause': Phaser.Input.Keyboard.KeyCodes.SPACE, 'switch_color': Phaser.Input.Keyboard.KeyCodes.C, 'radius_up': Phaser.Input.Keyboard.KeyCodes.P, 'radius_down': Phaser.Input.Keyboard.KeyCodes.M, 'switch_mode_dessin': Phaser.Input.Keyboard.KeyCodes.B, 'trait_droit': Phaser.Input.Keyboard.KeyCodes.ALT, 'rotate_left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'rotate_right': Phaser.Input.Keyboard.KeyCodes.RIGHT});
        
        palette_couleur = [[0xf2e2e2,0xf2e2e2,0xf2e2e2],[0xff00ff,0xcf22cf,0xcf33cf],[0xcf00ff,0x9f22cf,0x9f33cf],[0xaf00ff,0x7f22cf,0x7f33cf],[0x8f00ff,0x5f22cf,0x5f33cf],[0x00ff00,0x00df00,0x00cf00],[0x30ff30,0x30df30,0x30cf30],[0x60ff60,0x60df60,0x60cf60],[0x90ff90,0x90df90,0x90cf90],[0x000000,0x000000,0x000000],[0xfc20fc,0xeb10eb,0xda00da],[0xfa51fa,0xe940e9,0xd830d8],[0xf781e7,0xe670d6,0xd560c5],[0xf5b2e5,0xe4a1d4,0xd390c3]];
        
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
        
        if (random_start)
        {
            nb_trait = (7+Math.floor(5*Math.random()))*(num_l*num_c)/10000;
            for (let n = 0; n < nb_trait; n++)
            {
                /*
                x_start = Math.floor(config.width*Math.random());
                y_start = Math.floor(config.height*Math.random());
                theta = 2*Math.PI*Math.random();
                length_trait = 3+Math.floor(28*Math.random());
                for (let p = 0; p < length_trait; p++)
                {
                    let i_p = Math.floor(y_start/size_l);
                    let j_p = Math.floor(x_start/size_c);
                    for (let k = -size_radius; k <= size_radius; k++)
                    {
                        for (let l = -size_radius; l <= size_radius; l++)
                        {
                            if (Math.pow(Math.pow(k,2)+Math.pow(l,2),0.5) <= size_radius && 0<=i_p+k && i_p+k<num_l && 0<=j_p+l && j_p+l<num_c)
                            {
                                map[i_p+k][j_p+l] = color;
                                map_aux[i_p+k][j_p+l]  = color;
                                //draw(color,(j+l)*(size_c+angle_display)-angle_display*i,(i+k)*size_l,(size_c+angle_display),size_l);
                            }
                        }
                    }
                    d = 2+Math.floor((6*size_radius+1)*Math.random());
                    x_start += d*Math.cos(theta);
                    y_start += d*Math.sin(theta);
                    theta += 2*Math.PI/8*Math.random()-Math.PI/8;
                    if(p%3==0){size_radius = Math.min(Math.max(size_radius + Math.floor(3*Math.random())-1,0),4);}
                }
                */
                size_radius = 7;
                let i_n = Math.floor(num_l*Math.random());
                let j_n = Math.floor(num_c*Math.random());
                theta = 2*Math.PI*Math.random();
                length_trait = (14+Math.floor(28*Math.random()))*(num_c*num_l)/10000;
                for (let p = 0; p < length_trait; p++)
                {
                    for (let k = -size_radius; k <= size_radius; k++)
                    {
                        for (let l = -size_radius; l <= size_radius; l++)
                        {
                            if (Math.pow(Math.pow(k,2)+Math.pow(l,2),0.5) <= size_radius && 0<=i_n+k && i_n+k<num_l && 0<=j_n+l && j_n+l<num_c)
                            {
                                map[i_n+k][j_n+l] += Math.floor(size_radius-Math.pow(k*k+l*l,1/2));
                                map_aux[i_n+k][j_n+l] += Math.floor(size_radius-Math.pow(k*k+l*l,1/2));
                                //map[i_n+k][j_n+l] = color;
                                //map_aux[i_n+k][j_n+l]  = color;
                                //draw(color,(j+l)*(size_c+angle_display)-angle_display*i,(i+k)*size_l,(size_c+angle_display),size_l);
                            }
                        }
                    }
                    d = (Math.floor((1*size_radius+1)*Math.random()))*(num_l*num_c)/10000;
                    i_n += Math.round(d*Math.cos(theta));
                    j_n += Math.round(d*Math.sin(theta));
                    theta += 2*Math.PI/8*Math.random()-Math.PI/8;
                    if(p%3==0){size_radius = Math.min(Math.max(size_radius + Math.floor(3*Math.random())-1,0),4);}
                }
            }
        }
        
        for (let i = 0; i < num_l; i++)
        {
            for (let j = 0; j < num_c; j++)
            {
                map_aux[i][j] = map[i][j];
                draw(map[i][j],i,j);
            }
        }
        size_radius = size_radius_init;
    }
    
    update ()
    {
        if (cursors.pause.isUp && pause_possible)
        {
            if (pause){pause = false;}
            else{pause = true;}
            pause_possible = false;
        }
        if (cursors.pause.isDown){pause_possible = true;}
        
        if (cursors.switch_color.isUp && switch_color_possible)
        {
            if (color == 1){color = 0;}
            else{color = 1;}
            switch_color_possible = false;
            helpText.setText("M = taille brush moins grande \n P = taille brush plus grande \n B = mode brush "+mode_dessin+"\n C = couleur "+color*2-1);
        }
        if (cursors.switch_color.isDown){switch_color_possible = true;}
        
        if (cursors.switch_mode_dessin.isUp && switch_mode_dessin_possible)
        {
            if (mode_dessin == 0){mode_dessin = 1;}
            else{mode_dessin = 0;}
            switch_mode_dessin_possible = false;
        }
        if (cursors.switch_mode_dessin.isDown){switch_mode_dessin_possible = true;}
        
        if (cursors.radius_up.isUp && radius_up_possible && !mode_score)
        {
            size_radius++;
            radius_up_possible = false;
        }
        if (cursors.radius_up.isDown){radius_up_possible = true;}
        
        if (cursors.radius_down.isUp && radius_down_possible)
        {
            if (size_radius!=0){size_radius--;}
            radius_down_possible = false;
        }
        if (cursors.radius_down.isDown){radius_down_possible = true;}
        
        if (cursors.rotate_left.isUp && rotate_left_possible)
        {
            angle_display = Math.max(0,angle_display-1);
            config.width = config.width;
            rotate_left_possible = false;
            graphics.clear();
            for (let im = 0; im < num_l; im++)
            {
                for (let jm = 0; jm < num_c; jm++)
                {
                    draw(map[im][jm],im,jm);

                }
            }
        }
        if (cursors.rotate_left.isDown){rotate_left_possible = true;}
        
        if (cursors.rotate_right.isUp && rotate_right_possible)
        {
            angle_display = Math.min(40,angle_display+1);
            rotate_right_possible = false;
            graphics.clear();
            for (let im = 0; im < num_l; im++)
            {
                for (let jm = 0; jm < num_c; jm++)
                {
                    draw(map[im][jm],im,jm);

                }
            }
        }
        if (cursors.rotate_right.isDown){rotate_right_possible = true;}
        
        if (this.input.activePointer.isDown && 0<game.input.mousePointer.y<config.height && 0<game.input.mousePointer.x<config.width && ((reserve_mouse>0 && reserve_mouse2>0) || !mode_score))
        {
            let i = Math.floor((game.input.mousePointer.y-70)/size_l);
            let j = Math.floor((game.input.mousePointer.x-70-num_l*(angle_display+decalage_diag)+(angle_display+decalage_diag)*i+(angle_display/size_l*(70+(i+1)*size_l-1-game.input.mousePointer.y)))/(size_c+angle_display));
            for (let k = -size_radius; k <= size_radius; k++)
            {
                for (let l = -size_radius; l <= size_radius; l++)
                {
                    if (Math.pow(Math.pow(k,2)+Math.pow(l,2),0.5) <= size_radius && 0<=i+k && i+k<num_l && 0<=j+l && j+l<num_c)
                    {
                        if (map[i+k][j+l] == 0 || timing2%5 == 0)
                        {
                            if (mode_dessin == 0)
                            {
                                if (color == 1)
                                {
                                    map[i+k][j+l] = Math.min(map[i+k][j+l] + 1,4);
                                    map_aux[i+k][j+l]  = Math.min(map_aux[i+k][j+l] + 1,4);
                                }
                                else
                                {
                                    map[i+k][j+l] = Math.max(map[i+k][j+l] - 1,0);
                                    map_aux[i+k][j+l]  = Math.max(map_aux[i+k][j+l] - 1,0);
                                }
                            }
                            else
                            {
                                if (color == 1)
                                {
                                    //map[i+k][j+l] += Math.floor(size_radius-Math.pow(k*k+l*l,1/2))%32;
                                    //map_aux[i+k][j+l]  += Math.floor(size_radius-Math.pow(k*k+l*l,1/2))%32;
                                    
                                    map[i+k][j+l] = Math.floor((size_radius*size_radius-Math.abs(k*l))/size_radius);
                                    map_aux[i+k][j+l]  = Math.floor((size_radius*size_radius-Math.abs(k*l))/size_radius);
                                    
                                    //map[i+k][j+l] = color;
                                    //map_aux[i+k][j+l]  = color;
                                }
                                else
                                {
                                    map[i+k][j+l] = Math.max(0,map[i+k][j+l]-Math.floor(size_radius-Math.pow(k*k+l*l,1/2)));
                                    map_aux[i+k][j+l]  = Math.max(0,map_aux[i+k][j+l]-Math.floor(size_radius-Math.pow(k*k+l*l,1/2)));
                                }
                            }
                        }
                    }
                }
            }
            
            graphics.clear();
            for (let im = 0; im < num_l; im++)
            {
                for (let jm = 0; jm < num_c; jm++)
                {
                    draw(map[im][jm],im,jm);

                }
            }
            
            if(mode_score)
            {
                reserve_mouse--;
                reserveText.setText("reserve longueur clic = "+reserve_mouse);
                mouse_possible =true;
            }
        }
        
        if (mouse_possible && !this.input.activePointer.isDown)
        {
            if (mode_score)
            {
                reserve_mouse2--;
                reserveText2.setText("reserve nombre clic = "+reserve_mouse2);
                mouse_possible = false;
            }
        }
        
        if (!pause)
        {
            if (timing == 0)
            {
                graphics.clear();
                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        //Comptage des voisins
                        let compteur1 = 0;
                        let compteur2 = 0;
                        let compteur3 = 0;
                        let compteur4 = 0;
                        let compteur5 = 0;
                        for (let k = -1; k < 2; k++)
                        {
                            for (let l = -1; l < 2; l++)
                            {
                                let dep_ik = i+k;
                                let dep_jl = j+l;
                                if (dep_ik > num_l-1){dep_ik = 0}
                                else if (dep_ik < 0){dep_ik = num_l-1}
                                if (dep_jl > num_c-1){dep_jl = 0}
                                else if (dep_jl < 0){dep_jl = num_c-1}
                                if (k!=0 || l!=0)
                                {
                                    if (map[dep_ik][dep_jl] == 1){compteur1 += 1;}
                                    else if (map[dep_ik][dep_jl] == 2){compteur2 += 1;}
                                    else if (map[dep_ik][dep_jl] == 3){compteur3 += 1;}
                                    else if (map[dep_ik][dep_jl] == 4){compteur4 += 1;}
                                    else if (map[dep_ik][dep_jl] >= 5){compteur5 += 1;}
                                }
                            }
                        }
                        
                        //Regles d'evolution
                        if (map[i][j] == 0)
                        {
                            if (compteur1 > 0){map_aux[i][j] += 1;}
                        }
                        else if (map[i][j] >= 1 && map[i][j] <= 30)
                        {
                            map_aux[i][j] += 1;
                        }
                        else if (map[i][j] == 31)
                        {
                            map_aux[i][j] = 1;
                        }
                        //Affichage si changement
                        //if (map[i][j] != map_aux[i][j]){draw(map_aux[i][j],j*(size_c+angle_display),i*size_l,(size_c+angle_display),size_l);}
                        draw(map_aux[i][j],i,j);
                        
                    }
                }

                compteur_cases_non_vides = 0;
                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        if(map_aux[i][j]!=0){compteur_cases_non_vides++}
                        map[i][j] = map_aux[i][j];
                    }
                }
                if (mode_score)
                {
                    if(scoreMax<compteur_cases_non_vides)
                    {
                        scoreMax = compteur_cases_non_vides;
                        nb_tour_var_max = nb_tour_var_max_max;
                    }
                    else
                    {
                        nb_tour_var_max--;
                    }                
                    if(nb_tour_var_max<=0)
                    {
                        pause=true;
                        scoreText.setVisible(false);
                        scoreFinalText = this.add.text(config.width/2-650, config.height/2-80,"Score max = "+scoreMax, {
                            fontSize: '120px',
                            padding: { x: 10, y: 5 },
                            fill: '#000000'
                        });
                    }
                }
                if (mode_score)
                {
                    scoreText.setFontSize(18+Math.floor(compteur_cases_non_vides/30));
                    scoreText.setText(compteur_cases_non_vides);
                }
            }
            timing = (timing+1)%5;
        }
        timing2 = (timing2+1)%1000;
    }
}

function clean()
{
    for (let j = 0; j < num_c; j++)
    {
        if(map_aux[0][j]==0 || map_aux[0][j]>=5)
        {
            draw(9,-1,j);
            draw(9,-2,j);
        }
        if(map_aux[num_l-1][j]<5)
        {
            draw(9,num_l,j);
            draw(9,num_l+1,j);
        }
    }
    for (let i = 0; i < num_l; i++)
    {
        if(map_aux[i][0]==0 || map_aux[i][0]>=5)
        {
            draw(9,i,-1);
            draw(9,i,-2);
        }
    }
}

function draw(color,i,j)
{
    let x = j*(size_c+angle_display)-(angle_display+decalage_diag)*i;//+angle_display*(num_l-i);
    let y = i*size_l;
    let lx = size_c;
    let ly = size_l;
    let hauteur;
    let ind_color;
    
    if (color == 0)     {ind_color = 0; hauteur = 0;}
    else if (color == 1){ind_color = 1; hauteur = 2;}
    else if (color == 2){ind_color = 2; hauteur = 3;}
    else if (color == 3){ind_color = 3; hauteur = 4;}
    else if (color == 4){ind_color = 4; hauteur = 5;}
    else if (color == 5){ind_color = 4; hauteur = 6;}
    else if (color == 6){ind_color = 4; hauteur = 8;}
    else if (color == 7){ind_color = 4; hauteur = 10;}
    else if (color == 8){ind_color = 4; hauteur = 8;}
    else if (color == 9){ind_color = 3; hauteur = 7;}
    else if (color == 10){ind_color = 2; hauteur = 6;}
    else if (color == 11){ind_color = 1; hauteur = 5;}
    else if (color == 12){ind_color = 10; hauteur = 4;}
    else if (color == 13){ind_color = 11; hauteur = 3;}
    else if (color == 14){ind_color = 12; hauteur = 2;}
    else if (color == 15){ind_color = 13; hauteur = 1;}
    else if (color >= 16){ind_color = 0; hauteur = 0;}
    else                {ind_color = 8; hauteur = -16;}
    
    hauteur = (hauteur<0)?0:6*hauteur;
    
    if (angle_display == 0){hauteur = 0;}
    y -= hauteur;
    
    if (size_c < lim_display_grid)
    {
        if (hauteur >= 0){make_poly(i,j,x,y,lx,ly,hauteur,ind_color,0);}
        else {make_poly(i,j,x,y,lx,ly,hauteur,ind_color,0);}
    }
    else
    {
        if (hauteur >= 0){make_poly(i,j,x,y,lx,ly,hauteur,ind_color,1);}
        else {make_poly(i,j,x,y,lx,ly,hauteur,ind_color,1);}
    }
}

function make_poly(i,j,x,y,lx,ly,hauteur,ind_color,decalage)
{
    graphics.lineStyle(5, 0xFF0FFF, 1.0);
    let poly = new Phaser.Geom.Polygon();

    poly.setTo([ new Phaser.Geom.Point(x+decalage, y+decalage), new Phaser.Geom.Point(x+lx+angle_display-decalage, y+decalage), new Phaser.Geom.Point(x+lx-decalage, y+ly-decalage), new Phaser.Geom.Point(x-angle_display+decalage, y+ly-decalage) ]);
    graphics.fillStyle(palette_couleur[ind_color][0], 1);
    graphics.fillPoints(poly.points, true);

    if (angle_display > 0)
    {
        poly.setTo([ new Phaser.Geom.Point(x-angle_display+decalage, y+ly-decalage), new Phaser.Geom.Point(x+lx-decalage, y+ly-decalage), new Phaser.Geom.Point(x+lx-decalage, y+ly-decalage+hauteur), new Phaser.Geom.Point(x-angle_display+decalage, y+ly+hauteur-decalage) ]);
        graphics.fillStyle(palette_couleur[ind_color][1], 1);
        graphics.fillPoints(poly.points, true);

        poly.setTo([ new Phaser.Geom.Point(x+lx-decalage, y+ly-decalage), new Phaser.Geom.Point(x+lx+angle_display-decalage, y+decalage), new Phaser.Geom.Point(x+lx+angle_display-decalage, y+decalage+hauteur), new Phaser.Geom.Point(x+lx-decalage, y+ly-decalage+hauteur) ]);
        graphics.fillStyle(palette_couleur[ind_color][2], 1);
        graphics.fillPoints(poly.points, true);
    }
}