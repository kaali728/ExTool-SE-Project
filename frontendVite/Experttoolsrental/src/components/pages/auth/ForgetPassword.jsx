import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Flex, Input, Text, Button, Spacer } from '@findnlink/neuro-ui'
import scss from './Login.module.scss'

function ForgetPassword() {
    let navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    return (
        <Grid _class={scss.gridWrapper}>
            <Flex alignItems="center" justifyContent="center">
                <Text style={{ fontSize: 50 }} color={'--text100'}>
                    Forget Password
                </Text>
                <Spacer margin="l" />
                <Input
                    value={form.email}
                    onChange={(e) => {
                        setForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }}
                    placeholder="Your Email"
                />
                <Button padding="s xl" margin="l m" primary scale="l">
                    Send Email
                </Button>
                <Text>
                    Not registered yet?
                    <Text
                        pointer
                        weight="bold"
                        color={'--primary'}
                        onClick={() => navigate('/signup')}
                        style={{ textAlign: 'center' }}
                    >
                        Create Account
                    </Text>
                </Text>
            </Flex>
        </Grid>
    )
}

export default ForgetPassword
