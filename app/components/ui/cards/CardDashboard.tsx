'use client'

import { Container, Card, Form, Row, Col, Dropdown, ButtonGroup } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"
import useDashboard from "@/hooks/useDashboard";
import { useState } from "react";
import { BSButton, ComingSoon } from "@/components";
import { FaAngleDown } from "react-icons/fa6";
import { useTheme } from 'next-themes'
import { type Locale } from '@/i18n'
import '@/styles/ui/Roles.scss'

type Props = {
  dict: Dictionary;
  lang: Locale;
}

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function CardDashboard({ dict, lang }: Props) {
  const { data, loading, error, status, sendData, sendAnnouncement } = useDashboard();
  const { resolvedTheme } = useTheme();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [requestUrl, setRequestUrl] = useState('');
  const [method, setMethod] = useState('');
  const [HTTPStatus, setHTTPStatus] = useState('');

  const [messageTitle, setMessageTitle] = useState('');
  const [messageDescription, setMessageDescription] = useState('');
  const [messageAuthor, setMessageAuthor] = useState('');
  const [messageFooter, setMessageFooter] = useState('');
  const [messageAuthorIcon, setMessageAuthorIcon] = useState('');
  const [announcementTag, setAnnouncementTag] = useState('');
  const [roleTag, setRoleTag] = useState<string | null>(null);
  const [emojiTag, setEmojiTag] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [messageType, setMessageType] = useState<"embed" | "error" | "announcement" | null>(null);

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isEmojiDropdownOpen, setIsEmojiDropdownOpen] = useState(false);

  const methods = [
    { method: "GET" },
    { method: "POST" },
    { method: "PUT" },
    { method: "PATCH" },
    { method: "DELETE" }
  ];

  const announcementTags = [
    { label: '🜲 Founder', color: 'founder', role_id: '1282025660730310676' },
    { label: '♛Chief Executive Officer', color: 'ceo', role_id: '1282025846676127785' },
    { label: '👑Chief Administrative Officer', color: 'cao', role_id: '1282300248533897227' },
    { label: '👑Chief Operating Officer', color: 'coo', role_id: '1282300202753069117' },
    { label: 'Community Manager', color: 'cm', role_id: '1282247458675757086' },
    { label: 'Management', color: 'theme', role_id: '1285559909060182026' },
    { label: 'Human Resources Director👥', color: 'hrd', role_id: '1282300994046394498' },
    { label: 'Human Resources👥', color: 'hr', role_id: '1282090397828382802' },
    { label: 'Recruitment Team Director📋', color: 'rtd', role_id: '1282301484788092979' },
    { label: 'Event Team Manager', color: 'etm', role_id: '1282301578312941588' },
    { label: 'Media Team Manager', color: 'mtm', role_id: '1282301155598405674' },
    { label: 'Convoy Control Manager', color: 'ccm', role_id: '1282301688266358795' },
    { label: 'Upper Staff', color: 'theme', role_id: '1285585227091279883' },
    { label: 'Recruitment Team📋', color: 'rt', role_id: '1282091153910661170' },
    { label: 'Event Team', color: 'et', role_id: '1282301640589705226' },
    { label: 'Media Team', color: 'mt', role_id: '1282301423413104701' },
    { label: 'Convoy Control', color: 'cc', role_id: '1282301801080815636' },
    { label: 'Staff Team', color: 'staff', role_id: '1282090713751883857' },
    { label: 'Lower Staff', color: 'theme', role_id: '1285560716085952623' },
    { label: 'Driver🚚', color: 'driver', role_id: '1282026105238327317' },
    { label: 'Member👤', color: 'member', role_id: '1282224309741293610' },
    { label: 'News Ping', color: 'ping', role_id: '1285587879896027187' },
    { label: 'everyone', color: 'theme', role_id: '1282025492354170972' },
  ];

  const roleTags = [
    { label: '🜲 Founder', color: 'founder', role_id: '1282025660730310676' },
    { label: '♛Chief Executive Officer', color: 'ceo', role_id: '1282025846676127785' },
    { label: '👑Chief Administrative Officer', color: 'cao', role_id: '1282300248533897227' },
    { label: '👑Chief Operating Officer', color: 'coo', role_id: '1282300202753069117' },
    { label: 'Community Manager', color: 'cm', role_id: '1282247458675757086' },
    { label: 'Management', color: 'theme', role_id: '1285559909060182026' },
    { label: 'Human Resources Director👥', color: 'hrd', role_id: '1282300994046394498' },
    { label: 'Human Resources👥', color: 'hr', role_id: '1282090397828382802' },
    { label: 'Recruitment Team Director📋', color: 'rtd', role_id: '1282301484788092979' },
    { label: 'Event Team Manager', color: 'etm', role_id: '1282301578312941588' },
    { label: 'Media Team Manager', color: 'mtm', role_id: '1282301155598405674' },
    { label: 'Convoy Control Manager', color: 'ccm', role_id: '1282301688266358795' },
    { label: 'Upper Staff', color: 'theme', role_id: '1285585227091279883' },
    { label: 'Recruitment Team📋', color: 'rt', role_id: '1282091153910661170' },
    { label: 'Event Team', color: 'et', role_id: '1282301640589705226' },
    { label: 'Media Team', color: 'mt', role_id: '1282301423413104701' },
    { label: 'Convoy Control', color: 'cc', role_id: '1282301801080815636' },
    { label: 'Staff Team', color: 'staff', role_id: '1282090713751883857' },
    { label: 'Lower Staff', color: 'theme', role_id: '1285560716085952623' },
  ];

  const emojiTags = [
    { src: '/assets/icons/emojis/', emoji_name: ':ppls_logo:', emoji_id: '1288512722157441065' },
    { src: '/assets/icons/emojis/', emoji_name: ':peepo_ppls:', emoji_id: '1288526719992725577' },
    { src: '/assets/icons/emojis/', emoji_name: ':Scania:', emoji_id: '1282671955983601715' },
    { src: '/assets/icons/emojis/', emoji_name: ':peepo_love:', emoji_id: '1288523924094845030' },
    { src: '/assets/icons/emojis/', emoji_name: ':ets2:', emoji_id: '1283513953439322132' },
  ];

  const selectedAnnouncementTag = announcementTags.find((tag) => tag.role_id === announcementTag);
  const selectedRoleTag = roleTags.find((role) => role.role_id === roleTag);
  const selectedEmojiTag = emojiTags.find((emoji) => emoji.emoji_id === emojiTag);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // if (!messageType) return null;
    
    if (messageType === "error") {
      try {
        await sendData("error", title, url, message, requestUrl, method, HTTPStatus);

        resetForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`Error sending message to Discord: ${message}`);
      }
    } else if (messageType === "announcement") {
      try {
        const formData = {
          title: messageTitle,
          description: messageDescription,
          footer: messageFooter,
          author: messageAuthor,
          authorIcon: messageAuthorIcon,
          announcementTag: announcementTag,
          roleTag: roleTag,
          emojiTag: selectedEmojiTag?.emoji_name ? selectedEmojiTag.emoji_name + emojiTag : ''
        };

        await sendAnnouncement(formData);

        resetForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`Error sending message to Discord: ${message}`);
      }
    } else {
      try {
        await sendData("embed", title, url, message, '', '', '');

        resetForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`Error sending message to Discord: ${message}`);
      }
    }
  }

  function resetForm() {
    setTitle('');
    setUrl('');
    setMessage('');
    setRequestUrl('');
    setMethod('');
    setHTTPStatus('');
    setFormError(null);
  }

  if (error?.success === false && status === 403) {
    return (
      <div className="text-danger text-center d-flex align-items-center fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error.message}</div>
    )
  }

  return (
    <Container className="p-3 p-md-4" fluid>
      <Card className="rounded-1 border-0 shadow-sm-sm px-0 bg-surface text-theme">
        <Card.Header className="bg-surface d-flex justify-content-between align-items-center p-3 p-md-4 border-bottom">
          <Card.Title className="fs-3 m-0">Dashboard</Card.Title>

          <Dropdown as={ButtonGroup} className="message-type-dropdown" onToggle={(nextShow) => setIsTypeDropdownOpen(Boolean(nextShow))}>
            <BSButton variant="primary" className="text-light rounded-start-1 fw-semibold">{messageType ? messageType.charAt(0).toUpperCase() + messageType.slice(1) : 'Select Message Type'}</BSButton>
            
            <Dropdown.Toggle split variant="primary" className="px-2 d-flex align-items-center text-light" id="dropdown-split-basic">
              <span className={`ms-1 chevron-rotate-180 ${isTypeDropdownOpen ? 'is-open' : ''}`}>
                <FaAngleDown />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
              <Dropdown.Item onClick={() => setMessageType("embed")} className="py-1 px-3">Embed</Dropdown.Item>
              <Dropdown.Item onClick={() => setMessageType("error")} className="py-1 px-3">Error</Dropdown.Item>
              <Dropdown.Item onClick={() => setMessageType("announcement")} className="py-1 px-3">Announcement</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>

        <Card.Body className="p-3 p-md-4">
          {loading && <p>Loading...</p>}
          {data && <p className="text-success">Message sent successfully!</p>}
          {error && <p className="text-danger">Error: {error.message}</p>}
          
          {messageType === "error" ? (
            <Form onSubmit={handleSubmit} method="post">
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formTitle">
                    <Form.Label className="fw-bold">Title (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Your message title"
                      className="rounded-1 border-0 shadow-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">URL (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/dashboard"
                      className="rounded-1 border-0 shadow-sm"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">Request URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/api/endpoint"
                      className="rounded-1 border-0 shadow-sm"
                      value={requestUrl}
                      onChange={(e) => setRequestUrl(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formMethod">
                    <Form.Label className="fw-bold">HTTP Method</Form.Label>
                    <Form.Select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className={`rounded-1 border-0 shadow-sm d-flex ${method ? 'text-theme' : 'text-placeholder'}`}
                      required
                    >
                      <option value="" className="py-1 px-3 text-placeholder" disabled>Select method</option>
                      {methods.map((m) => (
                        <option key={m.method} value={m.method} className="py-1 px-3">{m.method}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formStatus">
                    <Form.Label className="fw-bold">HTTP Status</Form.Label>
                    <Form.Control
                      type="text"
                      className="rounded-1 border-0 shadow-sm"
                      placeholder="e.g. 200, 404, 500"
                      value={HTTPStatus}
                      onChange={(e) => setHTTPStatus(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}></Col>
              </Row>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label className="fw-bold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Enter your message here..."
                  rows={5}
                  className="rounded-1 border-0 shadow-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <BSButton variant="primary" type="submit">Send to Discord</BSButton>
            </Form>
          ) : messageType === 'announcement' ? (
              <Form onSubmit={handleSubmit} method="post">
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formAuthor">
                      <Form.Label className="fw-bold">Author</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Your announcement author"
                        className="rounded-1 border-0 shadow-sm"
                        value={messageAuthor}
                        onChange={(e) => setMessageAuthor(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formAuthorIcon">
                      <Form.Label className="fw-bold">Author Icon</Form.Label>
                      <Form.Control
                        type="text"
                        name="url"
                        placeholder="https://example.com/icon.png"
                        className="rounded-1 border-0 shadow-sm"
                        value={messageAuthorIcon}
                        onChange={(e) => setMessageAuthorIcon(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="announcementTag">
                      <Form.Label className="fw-bold">Announcement Tag</Form.Label>
                      <Dropdown className="tag-dropdown" onToggle={(nextShow) => setIsTagDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedAnnouncementTag ? selectedAnnouncementTag.color : ''}`}>
                          <span className={selectedAnnouncementTag ? '' : 'text-placeholder'}>{selectedAnnouncementTag ? `@${selectedAnnouncementTag.label}` : 'Select tag'}</span>
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isTagDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
                          {announcementTags.map((tag) => (
                            <Dropdown.Item key={tag.role_id} onClick={() => setAnnouncementTag(tag.role_id)} className={`py-1 px-3 ${tag.color}`}>@{tag.label}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="announcementRole">
                      <Form.Label className="fw-bold">Footer Role</Form.Label>
                      <Dropdown className="role-dropdown" onToggle={(nextShow) => setIsRoleDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedRoleTag ? selectedRoleTag.color : ''}`}>
                          <span className={selectedRoleTag ? '' : 'text-placeholder'}>{selectedRoleTag ? `@${selectedRoleTag.label}` : 'Select tag'}</span>
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isRoleDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
                          <Dropdown.Item onClick={() => setRoleTag(null)} className="py-1 px-3 text-theme">No Role</Dropdown.Item>
                          {roleTags.map((role) => (
                            <Dropdown.Item key={role.role_id} onClick={() => setRoleTag(role.role_id)} className={`py-1 px-3 ${role.color}`}>@{role.label}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="announcementEmoji">
                      <Form.Label className="fw-bold">Footer Emoji</Form.Label>
                      <Dropdown className="emoji-dropdown" onToggle={(nextShow) => setIsEmojiDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedEmojiTag ? 'theme' : ''}`}>
                          <span className={selectedEmojiTag ? '' : 'text-placeholder'}>{selectedEmojiTag ? `${selectedEmojiTag.emoji_name}` : 'Select tag'}</span>
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isEmojiDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
                          <Dropdown.Item onClick={() => setEmojiTag(null)} className="py-1 px-3 text-theme">No Emoji</Dropdown.Item>
                          {emojiTags.map((emoji) => (
                            <Dropdown.Item key={emoji.emoji_id} onClick={() => setEmojiTag(emoji.emoji_id)} className={`py-1 px-3 ${emoji.emoji_name}`}>{emoji.emoji_name}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formTitle">
                      <Form.Label className="fw-bold">Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Your announcement title"
                        className="rounded-1 border-0 shadow-sm"
                        value={messageTitle}
                        onChange={(e) => setMessageTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formFooter">
                      <Form.Label className="fw-bold">Footer</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="title"
                        placeholder="Your announcement footer"
                        className="rounded-1 border-0 shadow-sm"
                        value={messageFooter}
                        onChange={(e) => setMessageFooter(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="formMessage" className="mb-3">
                  <Form.Label className="fw-bold">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    placeholder="Enter your announcement here..."
                    rows={5}
                    className="rounded-1 border-0 shadow-sm"
                    value={messageDescription}
                    onChange={(e) => setMessageDescription(e.target.value)}
                    required
                  />
                </Form.Group>
                <BSButton variant="primary" type="submit">Send to Discord</BSButton>
              </Form>
          ) : (
            <Form onSubmit={handleSubmit} method="post">
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formTitle">
                    <Form.Label className="fw-bold">Title (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Your message title"
                      className="rounded-1 border-0 shadow-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">URL (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/dashboard"
                      className="rounded-1 border-0 shadow-sm"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label className="fw-bold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Enter your message here..."
                  rows={5}
                  className="rounded-1 border-0 shadow-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <BSButton variant="primary" type="submit">Send to Discord</BSButton>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
